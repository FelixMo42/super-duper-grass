let buildings = []
let stars = []

let background = ctx.createLinearGradient(
    width / 2, height, width / 2, 0
)
background.addColorStop(1, rgb(19,24,98));
background.addColorStop(0, rgb(84,107,171));

const grassDist = .5
const grassAngles = []
const grassLength = []

function init() {
    initBuildings()
    initStart()

    let pos = -1

    while (pos < width) {
        pos += grassDist

        grassAngles.push( random(Math.PI - .5, .5) )
        grassLength.push( random(5, 20) )
    }
}

function initBuildings() {
    for (let i = 3; i >= 0; i--) {
        let color = rgb(0 + i * 10, 0 + i * 10, 0 + i * 10)

        let pos = -100
        let ground = 300

        let y = height - ground

        while (pos < width) {
            let x = pos
            let w = random(20, 50)
            let h = random(20 * i, 100 + 50 * i)

            pos += w - 1

            buildings.push(() => {
                ctx.fillStyle = color
                ctx.fillRect(x, y, w, -h)
            })
        }
    }
}

class Star {
    constructor(f) {
        let s = this.s = random(1, 7)

        this.y = random(-s, height + s)
        
        this.x = random(-s, width + s)
        for (let i = 0; i < 2; i++) {
            let x = random(-s, width + s)
            if (Math.abs(x - f(this.y)) < Math.abs(this.x - f(this.y))) {
                this.x = x
            }
        }

        let grad = this.grad = ctx.createRadialGradient(
            this.x + s / 2, this.y + s / 2, 0,
            this.x + s / 2, this.y + s / 2, s / 2
        )
    
        grad.addColorStop(0, rgb(255,255,255,50))
        grad.addColorStop(1, rgb(255,255,255,0))
        
        this.twinkle = 1
    }

    update() {
        
    }

    draw(layer) {
        layer.ctx.fillStyle = this.grad
        layer.ctx.fillRect(this.x, this.y, this.s, this.s)
    }
}

function initStart() {
    let f = (y) => y + width / 2 - height / 2 
    for (let i = 0; i < 3000; i++) {
        stars.push( new Star(f) )
    }
}

function render() {
    bg(background)

    for (let star of stars) {
        draw(star)
    }

    for (let building of buildings) {
        draw(building)
    }

    draw(() => {
        ctx.rect(0, height - 300, width, 200);
        ctx.fillStyle = "black"
        ctx.fill()
    })

    draw(() => {
        let top = 200

        ctx.moveTo(0, height - top)

        let pos = -1
        let i = 0

        while (pos < width) {
            let base = grassDist
            let a = grassAngles[i]
            let l = grassLength[i]
            i += 1
            
            ctx.lineTo(0 + pos, height - top)
            ctx.lineTo(
                Math.floor(2 + pos + l * Math.cos(a)),
                Math.floor(height - top - l * Math.sin(a))
            )
            ctx.lineTo(4 + pos, height - top)

            pos += base
        }

        ctx.lineTo(width, height - top)
        ctx.lineTo(width, height)
        ctx.lineTo(0, height)

        ctx.fillStyle = rgb(27,56,0)
        ctx.fill()
    })
}

let d = new Date();

function update() {
    for (let star of stars) {
        star.update()
    }

    for (let i in grassAngles) {
        grassAngles[i] = grassAngles[i] + (Math.random() - .5) / 6

        if (grassAngles[i] < .5) {
            grassAngles[i] = .5
        }

        if (grassAngles[i] > Math.PI - .5) {
            grassAngles[i] = Math.PI - .5
        }
    }
}