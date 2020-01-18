init()

function run() {
    update()
    render()

    requestAnimationFrame(run)
}

run()