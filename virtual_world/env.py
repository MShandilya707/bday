import copy

class DungeonEnv:
    def __init__(self, map_data):
        """
        map_data: list of strings representing the grid.
        '#': Wall, '.': Floor, '@': Agent Start, '>': Exit, 'K': Key, '+': Locked Door
        """
        self.grid = [list(row) for row in map_data]
        self.height = len(self.grid)
        self.width = len(self.grid[0])
        self.agent_pos = self._find_agent()
        self.inventory = []
        self.explored = set()
        self.health = 100
        self.done = False
        self.message = "You entered the dungeon."
        
        # Remove agent from initial grid to track it separately
        self.grid[self.agent_pos[0]][self.agent_pos[1]] = '.'
        self._update_explored()

    def _find_agent(self):
        for r in range(self.height):
            for c in range(self.width):
                if self.grid[r][c] == '@':
                    return (r, c)
        raise ValueError("Agent '@' not found in map data.")

    def _update_explored(self, view_size=5):
        r_c, c_c = self.agent_pos
        for r in range(r_c - view_size // 2, r_c + view_size // 2 + 1):
            for c in range(c_c - view_size // 2, c_c + view_size // 2 + 1):
                if 0 <= r < self.height and 0 <= c < self.width:
                    self.explored.add((r, c))

    def get_mental_map(self):
        """Returns the grid as the agent has explored it so far."""
        map_rows = []
        for r in range(self.height):
            row = []
            for c in range(self.width):
                if (r, c) == self.agent_pos:
                    row.append('@')
                elif (r, c) in self.explored:
                    row.append(self.grid[r][c])
                else:
                    row.append('?') # Unknown
            map_rows.append(" ".join(row))
        return "\n".join(map_rows)

    def get_observation(self, view_size=5):
        """Returns a textual representation of the agent's surroundings and mental map."""
        r_start = self.agent_pos[0] - view_size // 2
        r_end = r_start + view_size
        c_start = self.agent_pos[1] - view_size // 2
        c_end = c_start + view_size

        view = []
        for r in range(r_start, r_end):
            row = []
            for c in range(c_start, c_end):
                if 0 <= r < self.height and 0 <= c < self.width:
                    if (r, c) == self.agent_pos:
                        row.append('@')
                    else:
                        row.append(self.grid[r][c])
                else:
                    row.append('#')
            view.append(" ".join(row))
        
        obs_map = "\n".join(view)
        mental_map = self.get_mental_map()

        obs_text = (
            f"--- CURRENT OBSERVATION ---\n"
            f"Local View (5x5):\n{obs_map}\n\n"
            f"Mental Map (Everything you have explored, '?' is unknown):\n{mental_map}\n\n"
            f"Health: {self.health} | Inventory: {', '.join(self.inventory) if self.inventory else 'Empty'}\n"
            f"Status: {self.message}\n"
            f"---------------------------"
        )
        return obs_text

    def step(self, action):
        """Executes an action and returns (observation, done)."""
        r, c = self.agent_pos
        new_r, new_c = r, c
        self.message = ""

        if action == "move_up": new_r -= 1
        elif action == "move_down": new_r += 1
        elif action == "move_left": new_c -= 1
        elif action == "move_right": new_c += 1
        elif action == "grab":
            item = self.grid[r][c]
            if item == 'K':
                self.inventory.append("Key")
                self.grid[r][c] = '.'
                self.message = "You picked up a Key."
            else:
                self.message = "There is nothing here to grab."
            self._update_explored()
            return self.get_observation(), self.done
        elif action == "interact":
            # Check adjacent for doors or exit
            for dr, dc in [(-1,0), (1,0), (0,-1), (0,1)]:
                nr, nc = r + dr, c + dc
                if 0 <= nr < self.height and 0 <= nc < self.width:
                    target = self.grid[nr][nc]
                    if target == '+':
                        if "Key" in self.inventory:
                            self.grid[nr][nc] = '.'
                            self.message = "You used the Key to open the door."
                            self._update_explored()
                            return self.get_observation(), self.done
                        else:
                            self.message = "The door is locked. You need a Key."
                            return self.get_observation(), self.done
                    elif target == '>':
                        self.done = True
                        self.message = "You reached the exit! YOU WIN!"
                        return self.get_observation(), self.done
            self.message = "Nothing to interact with nearby."
            return self.get_observation(), self.done
        
        # Move logic
        if 0 <= new_r < self.height and 0 <= new_c < self.width:
            target = self.grid[new_r][new_c]
            if target in ['.', 'K', '>']:
                self.agent_pos = (new_r, new_c)
                direction = action.split('_')[1] if '_' in action else action
                self.message = f"You moved {direction}."
            elif target == '#':
                self.message = "You bumped into a wall."
            elif target == '+':
                self.message = "The door is locked."
        else:
            self.message = "You can't go that way."

        self._update_explored()
        return self.get_observation(), self.done

    def render_full(self):
        """Renders the entire map for debugging."""
        full_grid = copy.deepcopy(self.grid)
        r, c = self.agent_pos
        full_grid[r][c] = '@'
        return "\n".join([" ".join(row) for row in full_grid])
