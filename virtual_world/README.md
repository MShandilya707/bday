# Autonomous LLM Agent: Spatial Reasoning & Environment Harness

This project implements an intelligent agent harness that places a Large Language Model (Gemini 2.0 Flash) into a dynamic, partially-observable 2D dungeon environment. 

The core challenge addressed here is the **perceptual gap**: how to bridge a high-level reasoning engine (LLM) with a low-level state machine (the environment) while maintaining state consistency and spatial memory.

## Technical Architecture

### 1. The Environment Harness (`env.py`)
Unlike a standard full-observation grid, this system uses a **Field of View (FOV)** mechanic. The agent only receives a 5x5 local ASCII slice of the world at any given time.
- **State Management**: Tracks entity positions (Agent, Keys, Doors, Exit).
- **Persistent Mental Map**: To solve the "short-term memory" issue common in LLM agents, the harness maintains a global occupancy grid of every tile the agent has visited. This is fed back to the model as a "Mental Map," allowing for long-term path planning and efficient exploration of unknown areas.

### 2. The Agent Logic (`agent.py`)
The agent isn't just generating text; it functions as a controller within a closed loop.
- **Structured Reasoning**: The system enforces a JSON schema that requires the model to output its "reasoning" before its "action." This forces the model to use its latent chain-of-thought capabilities to process the mental map before committing to a move.
- **Context Management**: History is pruned to maintain a high signal-to-noise ratio, focusing on recent observations and the cumulative mental map.

### 3. Real-time Dashboard (`main.py`)
I implemented a terminal-based dashboard using `rich` to visualize the agent's internal state. This includes:
- **Tactical View**: Current local FOV.
- **Strategic View**: The cumulative Mental Map showing explored vs. unexplored (`?`) territory.
- **Thought Stream**: Live output of the agent's reasoning process.

## How to Run

1. **Install requirements**:
   ```bash
   pip install rich google-genai python-dotenv
   ```
2. **Configuration**:
   Add your `GEMINI_API_KEY` to a `.env` file in the root directory.
3. **Execute**:
   ```bash
   python main.py
   ```

## Design Decisions: Why a Grid World?
I chose a 2D Rogue-like grid because it isolates the hardest part of agent design: **spatial navigation and state-based goal completion.** By using ASCII representations, I can maximize the LLM's token efficiency while still creating complex scenarios (e.g., "find the key in room A to unlock the door in room B") that test the model's ability to plan several steps ahead.
