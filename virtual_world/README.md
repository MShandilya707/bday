# LLM Dungeon Crawler

A system that places a Gemini-powered LLM agent into a virtual Rogue-like dungeon. The agent must perceive its surroundings, reason about its goals, and take actions to find a key and escape.

## Project Structure
- `env.py`: The 2D grid dungeon environment.
- `agent.py`: The LLM agent harness (interfaces with Google GenAI).
- `main.py`: The simulation loop.
- `requirements.txt`: Python dependencies.

## How to Run

1. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Set up API Key:**
   Create a `.env` file in the `virtual_world` directory and add your Google GenAI API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

3. **Run the Simulation:**
   ```bash
   python main.py
   ```

### Advanced Features (Winning Upgrades)
- **Mental Map & Spatial Memory**: The environment now tracks every tile the agent has visited. The agent receives a "Mental Map" string (using `?` for unknown areas), allowing it to reason about where it has been and where it needs to explore next.
- **Rich CLI Dashboard**: Using the `rich` library, the simulation now runs in a beautiful full-screen dashboard with:
    - **Local FOV**: A 5x5 color-coded view of immediate surroundings.
    - **Agent's Mental Map**: A persistent view of everything the agent has "remembered."
    - **Thought Stream**: A dedicated pane showing the LLM's step-by-step reasoning.
    - **Live Stats**: Real-time health, inventory, and action tracking.

### Design Choices

### Environment
The environment is a **Rogue-like 2D Grid World**. This was chosen because:
- It is easily representable in text (ASCII), which LLMs excel at parsing.
- It allows for complex logic (keys, doors, pathfinding) without requiring a graphical engine.
- **Dynamic Mental Map**: By providing the agent with a memory of visited tiles, we solve the common "looping" problem in LLM agents and prove the model can handle long-term planning.

### Observation Representation
The agent receives:
- **Local View (5x5)**: Immediate tactical awareness.
- **Global Mental Map**: Strategic awareness of the explored world.
- **Health and Inventory** status.
- **Contextual Messages**.

### Action Space
- `move_up`, `move_down`, `move_left`, `move_right`: Simple navigation.
- `grab`: Interaction with items on the same tile.
- `interact`: Interaction with adjacent tiles (opening doors, exiting).

### LLM Integration
The system uses the `google-genai` SDK with the `gemini-2.0-flash-exp` model. The agent is prompted to output its reasoning and actions in a structured **JSON format**, ensuring reliable parsing and allowing us to peek into its "thought process."
