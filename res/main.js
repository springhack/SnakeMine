(function (window, undefined) {
    
    const COUNT = 20;

    let box = [];

    let direction = 0;

    let vector = [
        [1, 0],
        [0, 1],
        [0, -1],
        [-1, 0]
    ];

    let keyCode = {
        'ArrowDown' : 1,
        'ArrowUp' : 2,
        'ArrowRight' : 0,
        'ArrowLeft' : 3
    };

    let snake = [[0, 0]];

    let point = [COUNT - 1, 0];

    let main = document.getElementById('main');

    let init_box = () => {
        for (let i=0;i<COUNT;++i)
        {
            box[i] = [];
            for (let j=0;j<COUNT;++j)
            {
                box[i][j] = document.createElement('div');
                box[i][j].innerHTML = '&nbsp;';
                box[i][j].style.left = i*20 + 'px';
                box[i][j].style.top = j*20 + 'px';
                main.appendChild(box[i][j]);
            }
        }
    };

    let gen_point = () => {
        let t = [];
        for (let i=0;i<COUNT;++i)
            for (let j=0;j<COUNT;++j)
                if (box[i][j].className == 'box')
                    t.push([i, j]);
        let g = parseInt(Math.random()*(t.length - 1));
        point[0] = t[g][0];
        point[1] = t[g][1];
    };

    let check = (x, y) => {
        for (let i=0;i<snake.length;++i)
            if (snake[i][0] == x && snake[i][1] == y)
                return false;
        if (
            x >=0 &&
            x < COUNT &&
            y >= 0 &&
            y < COUNT
           )
            return true;
        return false;
    };

    let next = () => {
        let head = snake[0];
        let x = head[0] + vector[direction][0];
        let y = head[1] + vector[direction][1];
        if (check(x, y))
        {
            snake.unshift([x, y]);
            if (x == point[0] && y == point[1])
                gen_point(x, y);
            else
                snake.pop();
        } else {
            console.log('Wall');
            clearInterval(timer);
        }
        render();
    };

    let render = () => {
        for (let i=0;i<COUNT;++i)
            for (let j=0;j<COUNT;++j)
                box[i][j].className = 'box';
        for (let i=0;i<snake.length;++i)
            box[snake[i][0]][snake[i][1]].className += ` snake`;
        box[point[0]][point[1]].className += ` point`;
    };

    init_box();
    render();
    gen_point();
    render();

    let timer = setInterval(next, 1000);

    document.addEventListener('keydown', e => {
        if (e.code.startsWith('Arrow') && direction + keyCode[e.code] != 3)
            direction = keyCode[e.code];
    });

    window.arrow = x => {
        if (direction + x != 3)
            direction = x;
    };

})(window);
