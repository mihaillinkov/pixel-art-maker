document.addEventListener('DOMContentLoaded', () => {
    const activeColorHtml = document.getElementById('active-color');

    let paint = {
        defaultColor: '#f5b041',
        painting: false,
        width: 30,
        height: 17,
        action: 'brush'
    }

    activeColorHtml.value = paint.defaultColor;
    
    paint.grid = createGrid(paint);
    initGrid(paint);
    initPalette(colors);
    renderGrid(paint);
    
    document.getElementById('grid').addEventListener('mousedown', (e) => {
        const cell = e.target.closest('.cell');
        if (!cell) {
            return;
        }
        paint.painting = true;
        handleCellAction(cell, paint, activeColorHtml.value);
        renderGrid(paint);
    });

    document.getElementById('grid').addEventListener('mouseover', (e) => {
        const cell = e.target.closest('.cell');
        if (!cell || !paint.painting) {
            return;
        }
        handleCellAction(cell, paint, activeColorHtml.value);
        renderGrid(paint);
    })
    

    document.addEventListener('mouseup', () => paint.painting = false);

    document.getElementById('colors').addEventListener('click', (e) => {
        const color = e.target.closest('div[data-color]')
        if (!color) {
            return;
        }
        const activeColor = color.getAttribute('data-color');
        activeColorHtml.value = activeColor; 
    });

    document.getElementById('actions').addEventListener('click', e => {
        const actionButton = e.target.closest('a');
        if (!actionButton) {
            return;
        }
        const prevActiveAction = actionButton.parentNode.getElementsByClassName('action-button__active');
        prevActiveAction[0].classList.remove('action-button__active');

        paint.action = actionButton.getAttribute('data-action');
        actionButton.classList.add('action-button__active')
    })
});

const initGrid = (paint) => {
    const gridHtml = document.getElementById('grid');
    gridHtml.innerHTML = createGridView(paint).innerHTML;
}

const createGrid = ({width = 16, height = 9}) => {
    const grid = []
    for (let r = 0; r < height; r++) {
        const row = []
        for (let c = 0; c < width; c++) {
            row.push('#FFFFFF');
        }
        grid.push(row);
    }
    return grid;
}

const createGridView = ({width, height, grid}) => {
    const gridHtml = document.createElement('div');
    for (let r = 0; r < height; r++) {
        const row = document.createElement('div');
        row.classList = 'row';
        for (let c = 0; c < width; c++) {
            const cell = document.createElement('div');
            cell.classList = 'cell';
            cell.setAttribute('data-row', r);
            cell.setAttribute('data-col', c);
            row.append(cell);
        }
        gridHtml.append(row);
    }
    return gridHtml;
}

const initPalette = (colors = []) => {
    const palette = document.getElementById('colors');
    
    palette.innerHTML = '';
    for (const color of colors) {
        const colorPicker = document.createElement('div');
        colorPicker.style.backgroundColor = color;
        colorPicker.setAttribute('data-color', color);
        
        palette.append(colorPicker);
    }
}

const renderGrid = ({grid, width, height}) => {
    const gridHtml = document.getElementById('grid');
    for (let r = 0; r < height; r++) {
        for (let c = 0; c < width; c++) {
            gridHtml.children[r].children[c].style.backgroundColor = grid[r][c]
        }
    }    
}

const handleCellAction = (cell, paint, activeColor) => {
    const row = +cell.getAttribute('data-row');
    const col = +cell.getAttribute('data-col');
    if (paint.action == 'brush') {
        paint.grid[row][col] = activeColor;
    } 
    if (paint.action == 'fill') {
        fill(paint, activeColor, paint.grid[row][col], row, col);
    }
}

const fill = (paint, newColor, oldColor, row, col) => {
    const {grid, width, height} = paint;
    if (row < 0 || col < 0 || row >= height || col >= width) {
        return;
    }
    if (grid[row][col] != oldColor || oldColor == newColor) {
        return;   
    }
    grid[row][col] = newColor;
    for (let dx = -1; dx < 2; dx++) {
        for (let dy = -1; dy < 2; dy++) {
            if (Math.abs(dx) + Math.abs(dy) == 1) {
                fill(paint, newColor, oldColor, row + dy, col + dx);
            }
        }
    }
}

const colors = [
    "#f9ebea","#f2d7d5","#e6b0aa","#d98880","#cd6155","#c0392b","#a93226","#922b21","#7b241c","#641e16",
    "#fdedec","#fadbd8","#f5b7b1","#f1948a","#ec7063","#e74c3c","#cb4335","#b03a2e","#943126","#78281f", 
    "#f5eef8","#ebdef0","#d7bde2","#c39bd3","#af7ac5","#9b59b6","#884ea0","#76448a","#633974","#512e5f", 
    "#f4ecf7","#e8daef","#d2b4de","#bb8fce","#a569bd","#8e44ad","#7d3c98","#6c3483","#5b2c6f","#4a235a",
    "#eaf2f8","#d4e6f1","#a9cce3","#7fb3d5","#5499c7","#2980b9","#2471a3","#1f618d","#1a5276","#154360",
    "#ebf5fb","#d6eaf8","#aed6f1","#85c1e9","#5dade2","#3498db","#2e86c1","#2874a6","#21618c","#1b4f72",
    "#e8f8f5","#d1f2eb","#a3e4d7","#76d7c4","#48c9b0","#1abc9c","#17a589","#148f77","#117864","#0e6251",
    "#e8f6f3","#d0ece7","#a2d9ce","#73c6b6","#45b39d","#16a085","#138d75","#117a65","#0e6655","#0b5345",
    "#e9f7ef","#d4efdf","#a9dfbf","#7dcea0","#52be80","#27ae60","#229954","#1e8449","#196f3d","#145a32",
    "#eafaf1","#d5f5e3","#abebc6","#82e0aa","#58d68d","#2ecc71","#28b463","#239b56","#1d8348","#186a3b",
    "#fef9e7","#fcf3cf","#f9e79f","#f7dc6f","#f4d03f","#f1c40f","#d4ac0d","#b7950b","#9a7d0a","#7d6608",
    "#fef5e7","#fdebd0","#fad7a0","#f8c471","#f5b041","#f39c12","#d68910","#b9770e","#9c640c","#7e5109",
    "#fdf2e9","#fae5d3","#f5cba7","#f0b27a","#eb984e","#e67e22","#ca6f1e","#af601a","#935116","#784212",
    "#fbeee6","#f6ddcc","#edbb99","#e59866","#dc7633","#d35400","#ba4a00","#a04000","#873600","#6e2c00",
    "#fdfefe","#fbfcfc","#f7f9f9","#f4f6f7","#f0f3f4","#ecf0f1","#d0d3d4","#b3b6b7","#979a9a","#7b7d7d",
    "#f8f9f9","#f2f3f4","#e5e7e9","#d7dbdd","#cacfd2","#bdc3c7","#a6acaf","#909497","#797d7f","#626567",
    "#f4f6f6","#eaeded","#d5dbdb","#bfc9ca","#aab7b8","#95a5a6","#839192","#717d7e","#5f6a6a","#4d5656",
    "#f2f4f4","#e5e8e8","#ccd1d1","#b2babb","#99a3a4","#7f8c8d","#707b7c","#616a6b","#515a5a","#424949",
    "#ebedef","#d6dbdf","#aeb6bf","#85929e","#5d6d7e","#34495e","#2e4053","#283747","#212f3c","#1b2631",
    "#eaecee","#d5d8dc","#abb2b9","#808b96","#566573","#2c3e50","#273746","#212f3d","#1c2833","#17202a"
  ];