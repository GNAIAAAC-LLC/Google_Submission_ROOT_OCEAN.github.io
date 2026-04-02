class FlightController:
    def __init__(self):
        self.state = {"altitude": 10000.0, "velocity": 0.0}

    def update(self, env, energy: float):
        target_alt = 8000.0 if energy < 300.0 else 12000.0
        current_alt = self.state["altitude"]
        self.state["altitude"] += 0.1 * (target_alt - current_alt)
