(function (window, undefined) {
    
    const COUNT = 20;

    const RATIO = 0.6;

    const TIMER = 300;

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

    let boom = [];

    let mode = 0;

    let num = [];

    let flag = [];

    let snake = [[0, 0]];

    let point = [COUNT - 1, 0];

    let main = document.getElementById('main');
    let msg = document.getElementById('msg');

    let deal = (x, y) => {
        if (boom[x][y])
            return -1;
        let ret = 0;
        for (let i=-1;i<=1;++i)
            for (let j=-1;j<=1;++j)
                if (i != 0 || j != 0)
                {
                    let xx = i + x;
                    let yy = j + y;
                    if (xx >= 0 && yy >= 0 && xx < COUNT && yy < COUNT && boom[xx][yy])
                        ++ret;
                }
        return ret;
    };

    let init_box = () => {
        main.style.width = COUNT*20 + 'px';
        for (let i=0;i<COUNT;++i)
        {
            box[i] = [];
            boom[i] = [];
            flag[i] = [];
            for (let j=0;j<COUNT;++j)
            {
                box[i][j] = document.createElement('div');
                box[i][j].innerHTML = '&nbsp;';
                boom[i][j] = (Math.random()>(1 - RATIO));
                flag[i][j] = false;
            }
        }
        for (let i=0;i<COUNT;++i)
        {
            num[i] = [];
            for (let j=0;j<COUNT;++j)
            {
                main.appendChild(box[j][i]);
                box[i][j].innerHTML = num[i][j] = deal(i, j);
            }
        }
        for (let i=0;i<COUNT;++i)
            for (let j=0;j<COUNT;++j)
                boom[i][j] = false;
    };

    let gen_point = (x, y) => {
        if (x && y)
            if (mode == 0)
                map([[x, y]]);
            else
                pin(x, y);
        let t = [];
        for (let i=0;i<COUNT;++i)
            for (let j=0;j<COUNT;++j)
                if (box[i][j].className == 'box' && !flag[i][j])
                    t.push([i, j]);
        let g = parseInt(Math.random()*(t.length - 1));
        point[0] = t[g][0];
        point[1] = t[g][1];
    };

    let map = (arr) => {
        let tmp;
        while ((tmp = arr.shift()) != undefined)
        {
            let x = tmp[0];
            let y = tmp[1];
            boom[x][y] == true;
            if (num[x][y] != -1)
            {
                for (let i=-1;i<=1;++i)
                    for (let j=-1;j<=1;++j)
                        if (i != 0 || j != 0)
                        {
                            let xx = i + x;
                            let yy = j + y;
                            if (xx >= 0 && yy >= 0 && xx < COUNT && yy < COUNT && !boom[xx][yy] && num[xx][yy] != -1)
                            {
                                boom[xx][yy] = true;
                                arr.push([xx, yy]);
                            }
                        }
            } else {
                clearInterval(timer);
                msg.innerHTML = 'Boom !';
                console.log('Boom');
            }
        }
    };
    
    let pin = (x, y) => {
        flag[x][y] = true;
    };

    let isOK = () => {
        for (let i=0;i<COUNT;++i)
            for (let j=0;j<COUNT;++j)
                if (num[i][j] != -1)
                    if (!boom[i][j])
                        return false;
        for (let i=0;i<COUNT;++i)
            for (let j=0;j<COUNT;++j)
                if (num[i][j] == -1)
                    if (!flag[i][j])
                        return false;
        return true;
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
        if (isOK())
        {
            clearInterval(timer);
            msg.innerHTML = '~ WOW ~';
        }
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
            msg.innerHTML = 'Duang !';
            console.log('Crash');
            clearInterval(timer);
        }
        render();
    };

    let render = () => {
        for (let i=0;i<COUNT;++i)
            for (let j=0;j<COUNT;++j)
            {
                box[i][j].className = 'box';
                if (boom[i][j])
                    box[i][j].className += ` opacity`;
                if (flag[i][j])
                    box[i][j].className += ` flag`;
            }
        for (let i=0;i<snake.length;++i)
            box[snake[i][0]][snake[i][1]].className += ` snake`;
        box[point[0]][point[1]].className += ` point`;
    };

    init_box();
    render();
    gen_point(false, false);
    render();

    let timer = setInterval(next, TIMER);

    document.addEventListener('keydown', e => {
        if (e.code.startsWith('Arrow') && direction + keyCode[e.code] != 3)
            direction = keyCode[e.code];
    });

    window.arrow = x => {
        if (direction + x != 3)
            direction = x;
    };

    window.mode = (x, e) => {
        mode = x;
        Array.prototype.forEach.call(document.getElementsByClassName('btn'), t => t.className = 'btn');
        e.className += ' btn-clk';
        if (mode == 0)
            msg.innerHTML = '扫雷中';
        else
            msg.innerHTML = '插旗中';
    };

})(window);
