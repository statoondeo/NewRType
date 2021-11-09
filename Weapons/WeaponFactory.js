class WeaponFactory {
    static getBulletWeapon(playerShip) {
        const fireRate = 0.4;

        // Instanciation des etats
        let level1State = new WeaponState(new Level1BulletFireCommand(playerShip, new BlueBulletGameObject(playerShip.partition, new Vec2(1, 0)), fireRate, false), 1);
        let level2State = new WeaponState(new Level2BulletFireCommand(playerShip, new BlueBulletGameObject(playerShip.partition, new Vec2(1, 0)), fireRate, false), 2);
        let level3State = new WeaponState(new Level3BulletFireCommand(playerShip, new BlueBulletGameObject(playerShip.partition, new Vec2(1, 0)), fireRate, false), 3);
        let level4State = new WeaponState(new Level4BulletFireCommand(playerShip, new BlueBulletGameObject(playerShip.partition, new Vec2(1, 0)), fireRate, false), 4);
        let level5State = new WeaponState(new Level5BulletFireCommand(playerShip, new BlueBulletGameObject(playerShip.partition, new Vec2(1, 0)), fireRate, false), 5);

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