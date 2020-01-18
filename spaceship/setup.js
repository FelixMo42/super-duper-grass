var cameraPos;

function dt() {
    return 1 / frameRate()
}

function intersects(a,b,c,d,p,q,r,s) {
    var det, gamma, lambda;
    det = (c - a) * (s - q) - (r - p) * (d - b);
    if (det === 0) {
      return false;
    } else {
      lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
      gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
      return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
    }
}

function getPoint(point, angle, add=createVector(0, 0)) {
    return [
        point[0] * Math.cos(angle) - point[1] * Math.sin(angle) + add.x,
        point[1] * Math.cos(angle) + point[0] * Math.sin(angle) + add.y
    ]
}

class Particle {
    constructor() {
        this.particles = []
    }

    draw() {
        for (var particle of this.particles) {
            particle.timer -= dt()
            push()
            fill(100,100,100,255 * particle.timer)
            particle.draw()
            if (particle.timer < 0) {
                this.particles.splice(this.particles.indexOf(particle), 1)
            }
            pop()   
        }
    }

    add(particle) {
        this.particles.push(particle)
    }
}

class Func extends Promise {
    constructor(func, scene) {
        var finish
        super(resolve => {
            finish = resolve
        })
        this.finish = finish

        this.func = func
        this.scene = scene
    }

    do() {
        this.func()

        if ("isOver" in this && this.isOver()) {
            this.remove()
            this.finish()
        }
    }

    until(callback) {
        this.isOver = callback

        return this
    }
}

class Scene {
    funcs = {
        "draw": [],
        "click": [],
        "keydown": []
    }

    constructor() {
        game = this
    }

    on(role, callback) {
        var func = new Func(callback, this)
        
        func.remove = () => {
            this.funcs[role].splice(this.funcs[role].indexOf(func), 1)
        }
        
        this.funcs[role].push(func)

        return func
    }

    draw() {
        for (var func of this.funcs["draw"]) {
            func.do()
        }
    }

    click() {
        for (var func of this.funcs["click"]) {
            func.do()
        }
    }

    keyPressed() {
        for (var func of this.funcs["keydown"]) {
            func.do()
        }
    }
}

class Sprite {
    constructor() {
        this.angle = 0
        this.position = createVector(0,0)
        this.velocity = createVector(0,0)
    }

    draw() {
        push()

        translate(
            this.position.x + cameraPos.x,
            this.position.y + cameraPos.y
        )
        rotate(this.angle)

        beginShape()
        for (let i in this.shape) {
            vertex(this.shape[i][0], this.shape[i][1])
        }
        endShape(CLOSE)

        pop()
    }

    goTo(target, speed) {
        let movement = target.sub(this.position).setMag(speed)

        this.position = this.position.add(movement)
    }

    applyVelocity() {
        if ("maxVelocity" in this) {
            this.velocity.limit(this.maxVelocity)
        }
        var movement = p5.Vector.mult(this.velocity, dt())
        this.position = this.position.add( movement )
    }

    drag() {

    }

    collide(sprite) {
        for (let i = 0; i < this.shape.length; i++) {
            for (let j = 0; j < this.shape.length; j++) {
                if (intersects(
                    ...getPoint(
                        this.shape[i],
                        this.angle,
                        this.position
                    ),
                    ...getPoint(
                        this.shape[(i + 1) % this.shape.length],
                        this.angle,
                        this.position
                    ),

                    ...getPoint(
                        sprite.shape[j],
                        sprite.angle,
                        sprite.position
                    ),
                    ...getPoint(
                        sprite.shape[(j + 1) % this.shape.length],
                        sprite.angle,
                        sprite.position
                    )
                )) {
                    return true
                }
            }
        }
        return false
    }
}

//============================================================================//

var game;

function setup() {
    createCanvas(windowWidth, windowHeight)

    cameraPos = createVector(0, 0)

    main(new Scene())
}

function draw() {
    if (dt() > 1) {
        return
    }

    game.draw()
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight)
}


function mouseClicked() {
    game.click()
}

function mouseReleased() {

}

function keyPressed() {
    game.keyPressed()
}