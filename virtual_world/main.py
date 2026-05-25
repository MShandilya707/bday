import time
import os
from env import DungeonEnv
from agent import GeminiAgent
from rich.console import Console
from rich.layout import Layout
from rich.panel import Panel
from rich.live import Live
from rich.table import Table
from rich.text import Text

# A more complex dungeon map to test the mental map
MAP_DATA = [
    "####################",
    "#@.................#",
    "#.#######.########.#",
    "#.#.....#.#K#....#.#",
    "#.###.###.#.#.##.#.#",
    "#...#.#...#...#..#.#",
    "###.#.#.#######.##.#",
    "#...#.#..........#.#",
    "#.###.##########.#.#",
    "#.#..............#.#",
    "#.#.############.#.#",
    "#.#............#.#.#",
    "#.############.#.#.#",
    "#..............#+..#",
    "##################>#",
]

console = Console()

def make_layout() -> Layout:
    layout = Layout()
    layout.split_column(
        Layout(name="header", size=3),
        Layout(name="main"),
        Layout(name="footer", size=3),
    )
    layout["main"].split_row(
        Layout(name="left", ratio=1),
        Layout(name="right", ratio=2),
    )
    layout["left"].split_column(
        Layout(name="local_view", ratio=1),
        Layout(name="stats", size=6),
    )
    layout["right"].split_column(
        Layout(name="mental_map", ratio=2),
        Layout(name="reasoning", ratio=1),
    )
    return layout

def format_grid(grid_str):
    """Refined professional color palette."""
    text = Text()
    for char in grid_str:
        if char == '#': text.append(char, style="dim white") # Subdued walls
        elif char == '.': text.append(char, style="bright_black") # Minimal floor
        elif char == '@': text.append(char, style="bold green") # High-vis agent
        elif char == 'K': text.append(char, style="bold amber") # Important item
        elif char == '+': text.append(char, style="bold orange1") # Interactable
        elif char == '>': text.append(char, style="bold bright_green") # Objective
        elif char == '?': text.append(char, style="bright_black") # Hidden
        else: text.append(char)
    return text

def run_simulation(max_steps=100):
    # Quick API Check
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key or api_key == "YOUR_API_KEY_HERE":
        console.print("[bold red]SYSTEM_ERROR:[/bold red] KEY_NOT_FOUND in .env context.")
        return

    env = DungeonEnv(MAP_DATA)
    try:
        agent = GeminiAgent()
    except ValueError as e:
        console.print(f"[red]INIT_FAILURE:[/red] {e}")
        return

    layout = make_layout()
    layout["header"].update(Panel(Text("SPATIAL_LOGIC_ENGINE v1.0.4", justify="left", style="bold white"), border_style="bright_black"))
    layout["footer"].update(Panel(Text("WAITING_FOR_INITIAL_STATE...", justify="left"), border_style="bright_black"))

    with Live(layout, refresh_per_second=4, screen=True):
        obs = env.get_observation()
        done = False
        step = 0

        while not done and step < max_steps:
            step += 1
            
            # Agent decides action
            result = agent.act(obs)
            reasoning = result.get("reasoning", "...")
            action = result.get("action", "idle")

            # Update UI before step
            layout["reasoning"].update(Panel(reasoning, title="DECISION_LOGIC", border_style="white"))
            layout["footer"].update(Panel(f"STEP: {step:03} | ACTION: {action.upper()} | MSG: {env.message.upper()}", style="bold white", border_style="bright_black"))
            
            # Environment updates
            obs, done = env.step(action)
            
            # Update UI panels
            local_view_text = format_grid(obs.split("Local View (5x5):\n")[1].split("\n\n")[0])
            layout["local_view"].update(Panel(local_view_text, title="LOCAL_FOV_SCAN", border_style="white"))
            
            mental_map_text = format_grid(env.get_mental_map())
            layout["mental_map"].update(Panel(mental_map_text, title="PERSISTENT_SPATIAL_STATE", border_style="white"))
            
            stats_table = Table.grid(expand=True)
            stats_table.add_column(justify="left")
            stats_table.add_row(f"[bold white]VITAL_SIGNS:[/bold white] {env.health}%")
            stats_table.add_row(f"[bold white]ASSET_BUFFER:[/bold white] {', '.join(env.inventory) if env.inventory else 'NULL'}")
            layout["stats"].update(Panel(stats_table, title="TELEMETRY", border_style="white"))

            if done:
                layout["footer"].update(Panel("[bold green]TERMINAL_STATE_REACHED: GOAL_COMPLETED[/bold green]", border_style="green"))
                break
            
            time.sleep(5)

        if not done:
            layout["footer"].update(Panel("[bold red]FAILED: STEP LIMIT REACHED[/bold red]", border_style="red"))
        
        time.sleep(3)

if __name__ == "__main__":
    run_simulation()
