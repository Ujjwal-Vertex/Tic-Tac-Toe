
document.addEventListener('DOMContentLoaded', () => {
    // Game state
    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let gameActive = true;
    
    // DOM elements
    const cells = document.querySelectorAll('.cell');
    const statusDisplay = document.getElementById('status');
    const resetButton = document.getElementById('resetBtn');
    const themeButton = document.getElementById('themeBtn');
    const bgButton = document.getElementById('bgBtn');
    const bgOptions = document.getElementById('bgOptions');
    const overlay = document.querySelector('.overlay');
    
    // Winning conditions
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    
    // Handle cell click
    function handleCellClick(e) {
        const clickedCell = e.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));
        
        // If cell already used or game not active, ignore
        if (board[clickedCellIndex] !== '' || !gameActive) return;
        
        // Update board and UI
        board[clickedCellIndex] = currentPlayer;
        clickedCell.textContent = currentPlayer;
        clickedCell.classList.add(currentPlayer.toLowerCase());
        
        // Check for win or draw
        checkResult();
    }
    
    // Check for win or draw
    function checkResult() {
        let roundWon = false;
        let winningCombo = [];
        
        // Check all winning conditions
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            if (board[a] === '' || board[b] === '' || board[c] === '') continue;
            
            if (board[a] === board[b] && board[b] === board[c]) {
                roundWon = true;
                winningCombo = winningConditions[i];
                break;
            }
        }
        
        // If won
        if (roundWon) {
            gameActive = false;
            highlightWinningCells(winningCombo);
            showWinMessage(currentPlayer);
            createCelebration();
            return;
        }
        
        // If draw
        if (!board.includes('')) {
            statusDisplay.textContent = "Game ended in a draw!";
            statusDisplay.innerHTML += '<div class="win-message">😊 Play Again!</div>';
            gameActive = false;
            return;
        }
        
        // Continue game
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
    }
    
    // Highlight winning cells
    function highlightWinningCells(cellsIndexes) {
        cellsIndexes.forEach(index => {
            cells[index].classList.add('winning-cell');
        });
    }
    
    // Show win message with celebration
    function showWinMessage(winner) {
        const messages = {
            'X': ['🎉 X Wins! Amazing!', '🌟 X is the Champion!', '👑 X Rules the Board!'],
            'O': ['🎊 O Wins! Fantastic!', '💫 O is Unstoppable!', '🏆 O Takes the Crown!']
        };
        
        const randomMessage = messages[winner][Math.floor(Math.random() * messages[winner].length)];
        statusDisplay.innerHTML = `Player ${winner} wins! <div class="win-message">${randomMessage}</div>`;
    }
    
    // Create celebration effects
    function createCelebration() {
        // Fireworks
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const firework = document.createElement('div');
                firework.className = 'celebration';
                firework.style.left = `${Math.random() * 100}%`;
                firework.style.top = `${Math.random() * 100}%`;
                firework.style.setProperty('--tx', `${(Math.random() - 0.5) * 200}px`);
                firework.style.setProperty('--ty', `${(Math.random() - 0.5) * 200}px`);
                firework.style.backgroundColor = currentPlayer === 'X' ? 'var(--x-color)' : 'var(--o-color)';
                overlay.appendChild(firework);
                
                setTimeout(() => {
                    firework.remove();
                }, 1000);
            }, i * 50);
        }
        
        // Confetti
        for (let i = 0; i < 100; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = `${Math.random() * 100}%`;
                confetti.style.width = `${Math.random() * 10 + 5}px`;
                confetti.style.height = `${Math.random() * 10 + 5}px`;
                confetti.style.backgroundColor = getRandomColor();
                document.body.appendChild(confetti);
                
                setTimeout(() => {
                    confetti.remove();
                }, 3000);
            }, i * 30);
        }
    }
    
    // Get random color for confetti
    function getRandomColor() {
        const colors = [
            'var(--primary-color)',
            'var(--x-color)',
            'var(--o-color)',
            '#ffcc00',
            '#00cc66',
            '#9966ff'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    // Reset game
    function resetGame() {
        board = ['', '', '', '', '', '', '', '', ''];
        currentPlayer = 'X';
        gameActive = true;
        statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
        
        cells.forEach(cell => {
            cell.textContent = '';
            cell.className = 'cell';
        });
    }
    
    // Toggle dark/light mode
    function toggleTheme() {
        document.body.classList.toggle('dark-mode');
        
        // Update button icon and text
        const icon = themeButton.querySelector('i');
        const isDark = document.body.classList.contains('dark-mode');
        
        icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
        themeButton.innerHTML = `<i class="${icon.className}"></i> ${isDark ? 'Light' : 'Dark'} Mode`;
    }
    
    // Toggle background options
    function toggleBgOptions() {
        bgOptions.classList.toggle('show-bg-options');
    }
    
    // Change background
    function changeBackground(e) {
        if (!e.target.classList.contains('background-option')) return;
        
        const bgImage = e.target.style.backgroundImage;
        document.body.style.backgroundImage = bgImage;
        bgOptions.classList.remove('show-bg-options');
    }
    
    // Event listeners
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    resetButton.addEventListener('click', resetGame);
    themeButton.addEventListener('click', toggleTheme);
    bgButton.addEventListener('click', toggleBgOptions);
    bgOptions.addEventListener('click', changeBackground);
});
