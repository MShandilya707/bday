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
        Layout(name="left"),
        Layout(name="right"),
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
    """Adds colors to the ASCII grid."""
    text = Text()
    for char in grid_str:
        if char == '#': text.append(char, style="bold black on grey37")
        elif char == '.': text.append(char, style="white")
        elif char == '@': text.append(char, style="bold yellow")
        elif char == 'K': text.append(char, style="bold gold1")
        elif char == '+': text.append(char, style="bold red")
        elif char == '>': text.append(char, style="bold green")
        elif char == '?': text.append(char, style="dim white")
        else: text.append(char)
    return text

def run_simulation(max_steps=100):
    env = DungeonEnv(MAP_DATA)
    try:
        agent = GeminiAgent()
    except ValueError as e:
        console.print(f"[red]Configuration Error:[/red] {e}")
        return

    layout = make_layout()
    layout["header"].update(Panel(Text("LLM Dungeon Crawler - Advanced Agent Harness", justify="center", style="bold cyan")))
    layout["footer"].update(Panel(Text("Status: Initializing...", justify="center")))

    with Live(layout, refresh_per_second=4, screen=True):
        obs = env.get_observation()
        done = False
        step = 0
        last_reasoning = "Thinking..."

        while not done and step < max_steps:
            step += 1
            
            # Agent decides action
            result = agent.act(obs)
            reasoning = result.get("reasoning", "...")
            action = result.get("action", "idle")
            last_reasoning = reasoning

            # Update UI before step
            layout["reasoning"].update(Panel(reasoning, title="Agent Reasoning", border_style="yellow"))
            layout["footer"].update(Panel(f"Step {step} | Action: {action} | Status: {env.message}", style="bold white"))
            
            # Environment updates
            obs, done = env.step(action)
            
            # Update UI panels
            local_view_text = format_grid(obs.split("Local View (5x5):\n")[1].split("\n\n")[0])
            layout["local_view"].update(Panel(local_view_text, title="Local FOV", border_style="blue"))
            
            mental_map_text = format_grid(env.get_mental_map())
            layout["mental_map"].update(Panel(mental_map_text, title="Agent's Mental Map", border_style="magenta"))
            
            stats_table = Table.grid(expand=True)
            stats_table.add_column(justify="left")
            stats_table.add_row(f"[bold red]Health:[/bold red] {env.health}")
            stats_table.add_row(f"[bold gold1]Inventory:[/bold gold1] {', '.join(env.inventory) if env.inventory else 'Empty'}")
            layout["stats"].update(Panel(stats_table, title="Stats", border_style="green"))

            if done:
                layout["footer"].update(Panel("[bold green]SUCCESS: AGENT ESCAPED THE DUNGEON![/bold green]", border_style="green"))
                break
            
            time.sleep(0.5)

        if not done:
            layout["footer"].update(Panel("[bold red]FAILED: STEP LIMIT REACHED[/bold red]", border_style="red"))
        
        time.sleep(3)

if __name__ == "__main__":
    run_simulation()
