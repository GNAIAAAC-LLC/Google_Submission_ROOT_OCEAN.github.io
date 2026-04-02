from src.skycell_core import SkyCell, SkyCellConfig

def main():
    config = SkyCellConfig(id="SC-001")
    sc = SkyCell(config)

    for t in range(100):
        env = {
            "airflow": 0.5,
            "temperature_gradient": 0.3,
            "vibration_level": 0.2,
            "rf_density": 0.4,
        }
        sc.tick(env)
        print(f"t={t:03d} | energy={sc.energy:.2f} | altitude={sc.flight.state['altitude']:.1f}")

if __name__ == "__main__":
    main()
