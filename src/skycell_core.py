from dataclasses import dataclass
from .energy_harvest import EnergyHarvester
from .flight_control import FlightController
from .wireless_power import WirelessPowerModule


@dataclass
class SkyCellConfig:
    id: str
    max_energy: float = 1000.0
    min_safe_energy: float = 100.0


class SkyCell:
    def __init__(self, config: SkyCellConfig):
        self.config = config
        self.energy = config.max_energy * 0.5
        self.harvester = EnergyHarvester()
        self.flight = FlightController()
        self.wireless = WirelessPowerModule()

    def tick(self, env):
        harvested = self.harvester.harvest(env)
        self.energy += harvested

        self.flight.update(env, energy=self.energy)

        if self.energy > self.config.max_energy * 0.8:
            transmitted = self.wireless.transmit(self.energy - self.config.max_energy * 0.8)
            self.energy -= transmitted

        self.energy = max(0.0, min(self.energy, self.config.max_energy))
