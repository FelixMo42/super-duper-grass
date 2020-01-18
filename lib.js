/// colors ///

function rgb(r,g,b,a=255) {
    return `rgba(${r},${g},${b},${a})`
}

function hex(hex) {
    return `#${hex}`
}

// outher //

function random(min, max) {
    return Math.floor(Math.random() * (max - min) + min)
}

/// layers ///

class Layer {
    constructor(width, height) {
        this.canvas = document.createElement("canvas")
        this.ctx = this.canvas.getContext("2d")

        this.width = this.canvas.width = width
        this.height = this.canvas.height = height
    }

    draw(obj) {
        this.ctx.save()
        this.ctx.beginPath()

        if (typeof obj === "function") {
            obj(this)
        } else {
            obj.draw(this)
        }

        this.ctx.closePath()
        this.ctx.restore()
    }
}

// drawing ///

function bg(color) {
    ctx.save()

    ctx.fillStyle = color
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.restore()
}

/// set up ///

let canvas = document.getElementById("canvas")
let ctx = canvas.getContext("2d", { alpha: false } )

const width = canvas.width = window.innerWidth
const height = canvas.height = window.innerHeight

/// 

const baseLayer = {
    canvas: canvas,
    ctx: ctx,
    width: width,
    height: height
}

function draw(obj) {
    ctx.save()
    ctx.beginPath()

    if (typeof obj === "function") {
        obj(baseLayer)
    } else {
        obj.draw(baseLayer)
    }

    ctx.closePath()
    ctx.restore()
}