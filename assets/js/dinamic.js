let board, currentPlayer, resultShown;

    const winPatterns = [
      [0,1,2], [3,4,5], [6,7,8], 
      [0,3,6], [1,4,7], [2,5,8], 
      [0,4,8], [2,4,6]
    ];

    // Crear partículas flotantes
    function createFloatingParticles() {
      for (let i = 0; i < 20; i++) {
        setTimeout(() => {
          const particle = document.createElement('div');
          particle.className = 'particle';
          particle.style.left = Math.random() * window.innerWidth + 'px';
          particle.style.animationDelay = Math.random() * 3 + 's';
          particle.style.animationDuration = (Math.random() * 2 + 2) + 's';
          document.body.appendChild(particle);
          
          setTimeout(() => {
            particle.remove();
          }, 5000);
        }, i * 200);
      }
    }

    function startGame() {
      board = Array(9).fill("");
      currentPlayer = "X";
      resultShown = false;
      const boardDiv = document.getElementById("board");
      boardDiv.innerHTML = "";
      const resultDiv = document.getElementById("result");
      resultDiv.textContent = "";
      resultDiv.className = "result";
      
      for (let i = 0; i < 9; i++) {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.dataset.index = i;
        cell.addEventListener("click", onCellClick);
        boardDiv.appendChild(cell);
      }
      
      createFloatingParticles();
    }

    function onCellClick(e) {
      const index = e.target.dataset.index;
      if (board[index] !== "" || resultShown) return;
      
      board[index] = currentPlayer;
      e.target.textContent = currentPlayer;
      e.target.classList.add("celebration");
      
      setTimeout(() => {
        e.target.classList.remove("celebration");
      }, 600);
      
      if (checkWinner(currentPlayer)) {
        const resultDiv = document.getElementById("result");
        resultDiv.textContent = `🎯 ¡JUGADOR ${currentPlayer} HA VENCIDO LA MATRIZ!`;
        resultDiv.className = "result winner-announcement";
        resultShown = true;
        
        highlightWinningCells(currentPlayer);
        celebrateMatrixWin();
        
      } else if (board.every(cell => cell !== "")) {
        document.getElementById("result").textContent = "⚖️ EMPATE: LA MATRIZ PERMANECE EN EQUILIBRIO";
        resultShown = true;
      } else {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
      }
    }

    function checkWinner(player) {
      return winPatterns.some(pattern => pattern.every(i => board[i] === player));
    }

    function highlightWinningCells(player) {
      const winningPattern = winPatterns.find(pattern => pattern.every(i => board[i] === player));
      if (winningPattern) {
        const cells = document.querySelectorAll('.cell');
        winningPattern.forEach(index => {
          cells[index].classList.add('winner');
        });
      }
    }

    function celebrateMatrixWin() {
      // Confetti estilo Matrix con colores verdes/amarillos
      const duration = 4000;
      const animationEnd = Date.now() + duration;
      const defaults = { 
        startVelocity: 30, 
        spread: 360, 
        ticks: 60, 
        zIndex: 0,
        colors: ['#00ff41', '#ffff00', '#00ffff', '#39ff14']
      };

      function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
      }

      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        confetti(Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        }));
        
        confetti(Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        }));
      }, 250);

      // Explosión central especial
      setTimeout(() => {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#00ff41', '#ffff00', '#39ff14']
        });
      }, 500);

      createFloatingParticles();
    }

    function celebrateMatrixSimulation() {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.8 },
        colors: ['#00ff41', '#00ffff', '#39ff14']
      });

      setTimeout(() => {
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.8 },
          colors: ['#ffff00', '#00ff41', '#00ffff']
        });
      }, 400);

      createFloatingParticles();
    }

    function simulateGames(times) {
      let xWins = 0, oWins = 0, ties = 0;
      let gameDetails = [];

      for (let t = 0; t < times; t++) {
        let b = Array(9).fill("");
        let turn = "X";
        let winner = null;
        let how = "Empate";

        for (let moves = 0; moves < 9 && !winner; moves++) {
          let emptyIndices = b.map((v, i) => v === "" ? i : null).filter(i => i !== null);
          let choice = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
          b[choice] = turn;

          for (let p of winPatterns) {
            if (p.every(i => b[i] === turn)) {
              winner = turn;
              if (p[0] % 3 === 0 && p[1] % 3 === 1 && p[2] % 3 === 2) how = "Fila";
              else if (p[0] < 3 && p[1] < 6 && p[2] < 9 && p[0] % 3 === p[1] % 3) how = "Columna";
              else how = "Diagonal";
              break;
            }
          }

          turn = turn === "X" ? "O" : "X";
        }

        if (winner === "X") xWins++;
        else if (winner === "O") oWins++;
        else ties++;

        gameDetails.push({
          juego: t + 1,
          ganador: winner || "Empate",
          tipo: winner ? how : "Empate",
          tablero: drawBoard(b)
        });
      }

      const simulationDiv = document.getElementById("simulationResult");
      simulationDiv.innerHTML = `
        <p><strong>🔢 ANÁLISIS DE MATRIZ - ${times} SIMULACIONES:</strong></p>
        <p>🎯 Jugador X conquista: ${xWins} veces</p>
        <p>🎯 Jugador O conquista: ${oWins} veces</p>
        <p>⚖️ Equilibrio matriz: ${ties} veces</p>
        ${buildTable(gameDetails)}
      `;

      simulationDiv.classList.add("celebration");
      setTimeout(() => {
        simulationDiv.classList.remove("celebration");
      }, 600);

      celebrateMatrixSimulation();
    }

    function drawBoard(b) {
      return `
${b[0] || " "} | ${b[1] || " "} | ${b[2] || " "}
---------
${b[3] || " "} | ${b[4] || " "} | ${b[5] || " "}
---------
${b[6] || " "} | ${b[7] || " "} | ${b[8] || " "}
`;
    }

    function buildTable(games) {
      let rows = games.map(g => `
        <tr>
          <td>${g.juego}</td>
          <td>${g.ganador}</td>
          <td>${g.tipo}</td>
          <td class="tablero"><pre>${g.tablero}</pre></td>
        </tr>
      `).join("");

      return `
        <table>
          <thead>
            <tr>
              <th># Simulación</th>
              <th>Conquistador</th>
              <th>Método Victoria</th>
              <th>Estado Final</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      `;
    }

    // Inicializar con partículas
    startGame();