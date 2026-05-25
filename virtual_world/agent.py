import os
import json
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

SYSTEM_PROMPT = """
You are an intelligent agent trapped in a 2D Rogue-like dungeon. Your goal is to find the exit ('>').
To do this, you may need to find keys ('K') and use them to open locked doors ('+').

Map Legend:
'#': Wall (impassable)
'.': Floor (passable)
'@': You (your current position)
'K': Key (can be picked up with 'grab')
'+': Locked Door (requires a Key and 'interact' to open)
'>': Exit (requires 'interact' while standing next to it to win)
'?': Unknown territory (not yet explored)

Available Actions:
- move_up, move_down, move_left, move_right: Move one step in the specified direction.
- grab: Pick up an item (like a Key) at your current position.
- interact: Use an item (like a Key on a Door) or finish the level at the Exit.

Spatial Reasoning & Memory:
You will be provided with a 'Local View' (what you see now) and a 'Mental Map' (what you have seen so far).
Use the Mental Map to:
1. Avoid going in circles.
2. Remember where keys or doors were if you need to go back to them.
3. Identify unexplored areas ('?') to prioritize exploration.

You must think step-by-step.
Always respond in JSON format with:
1. "reasoning": A brief explanation of your thought process, referencing the mental map if needed.
2. "action": One of the available actions.
"""

class GeminiAgent:
    def __init__(self, api_key=None, model_id="gemini-2.0-flash"):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY not found in environment or provided.")
        
        self.client = genai.Client(api_key=self.api_key)
        self.model_id = model_id
        self.history = []

    def act(self, observation):
        """Sends the observation to Gemini and returns the parsed action."""
        prompt = f"{observation}\n\nWhat is your next action?"
        
        # We append the current observation to history to maintain context
        # but keep it concise to avoid token explosion.
        # For simplicity in this demo, we'll just send the system prompt + history + current prompt.
        
        contents = [
            types.Content(role="user", parts=[types.Part(text=SYSTEM_PROMPT)]),
            # Add history here if needed, but for now let's try just the current state + short history
            *[types.Content(role="user" if i % 2 == 0 else "model", parts=[types.Part(text=h)]) 
              for i, h in enumerate(self.history[-10:])],
            types.Content(role="user", parts=[types.Part(text=prompt)])
        ]

        try:
            response = self.client.models.generate_content(
                model=self.model_id,
                contents=contents,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json"
                )
            )
            
            response_text = response.text
            data = json.loads(response_text)
            
            # Store history
            self.history.append(prompt)
            self.history.append(response_text)
            
            return data
        except Exception as e:
            error_msg = str(e)
            # Check for common errors to provide better advice
            if "403" in error_msg:
                reason = "API Key error (403). Check if your key is correct and has Gemini API access."
            elif "429" in error_msg:
                reason = "Quota exceeded (429). You are sending too many requests."
            else:
                reason = f"API Error: {error_msg}"
            
            return {"reasoning": reason, "action": "idle"}
