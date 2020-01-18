async function main(scene) {
    var character = new Sprite()
    character.position = createVector(windowWidth / 2, windowHeight / 2)
    character.maxVelocity = 1000
    character.shape = [
        [20, 0],
        [-20, 15],
        [-10, 0],
        [-20, -15]
    ]

    var satellite = new Sprite()
    satellite.maxVelocity = 1000
    satellite.position = createVector(200, 200)
    satellite.shape = [
        [30,0],
        [0,30],
        [-30,0],
        [0,-30]
    ]

    var playerTrail = new Particle()

    scene.on("draw", () => {
        background(10)

        noStroke()

        if (keyIsDown(65)) {
            character.angle -= 3 * dt()
        }

        if (keyIsDown(68)) {
            character.angle += 3 * dt()
        }

        if (keyIsDown(87)) {
            character.velocity.add( createVector(1000 * dt(), 0).rotate(character.angle) )
        }

        character.velocity.x *= .99
        character.velocity.y *= .99

        character.applyVelocity()

        //

        if (character.collide(satellite)) {
            satellite.velocity.add(character.velocity)
        }

        satellite.velocity.x *= .99
        satellite.velocity.y *= .99

        satellite.applyVelocity()

        //

        var sprite = new Sprite()
        sprite.position = character.position.copy()
        sprite.angle = character.angle
        sprite.shape = character.shape
        sprite.timer = .5
        playerTrail.add(sprite)

        playerTrail.draw()

        fill("purple")
        satellite.draw()

        fill("white")
        character.draw()
    })
}