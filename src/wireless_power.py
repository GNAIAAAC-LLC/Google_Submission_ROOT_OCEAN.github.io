class WirelessPowerModule:
    def transmit(self, surplus_energy: float) -> float:
        transmitted = surplus_energy * 0.7
        return transmitted
