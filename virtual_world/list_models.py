import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

def list_models():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("GEMINI_API_KEY not found in .env file.")
        return

    client = genai.Client(api_key=api_key)
    
    print("--- Available Models ---")
    try:
        # Note: The newer google-genai SDK might have a different method for listing
        # If this fails, we'll try a different approach.
        for model in client.models.list():
            print(f"Name: {model.name}, Display Name: {model.display_name}")
    except Exception as e:
        print(f"Error listing models: {e}")

if __name__ == "__main__":
    list_models()
