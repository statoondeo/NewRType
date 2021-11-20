class WeaponFactory {
    static getBulletWeapon(playerShip) {
        const fireRate = 0.2;
        const weaponName = "Bullets";

        // Instanciation des etats
        let soundPool = new SoundPool(Services.get("ASSET").get("Sounds/laser1.mp3"), 15);
        let level1State = new WeaponState(weaponName, new Level1BulletFireCommand(playerShip, fireRate, soundPool), 1);
        let level2State = new WeaponState(weaponName, new Level2BulletFireCommand(playerShip, fireRate * 0.95, soundPool), 2);
        let level3State = new WeaponState(weaponName, new Level3BulletFireCommand(playerShip, fireRate * 0.9, soundPool), 3);
        let level4State = new WeaponState(weaponName, new Level4BulletFireCommand(playerShip, fireRate * 0.85, soundPool), 4);
        let level5State = new WeaponState(weaponName, new Level5BulletFireCommand(playerShip, fireRate * 0.8, soundPool), 5);

        // Liaisons entre les états
        level1State.previousWeaponState = level1State;
        level1State.nextWeaponState = level2State;

        level2State.previousWeaponState = level1State;
        level2State.nextWeaponState = level3State;

        level3State.previousWeaponState = level2State;
        level3State.nextWeaponState = level4State;

        level4State.previousWeaponState = level3State;
        level4State.nextWeaponState = level5State;

        level5State.previousWeaponState = level4State;
        level5State.nextWeaponState = level5State;

        return new Weapon(playerShip, level1State);
    }
}