let fazendeiro;
let coelho;
let cenouras = [];
let toca;
let pontuacao = 0;
let cenourasPerdidas = 0;
let maxCenourasPerdidas = 10; // Limite de cenouras que o coelho pode comer
let tempoLimite = 60; // Tempo de jogo em segundos
let tempoInicio;
let jogoAcabou = false;
let metaCenouras = 10; // NOVO: Quantas cenouras o fazendeiro precisa coletar para vencer

// Imagens (não serão usadas para fazendeiro/coelho, mas mantidas caso queira usar para cenoura/toca)
let imgCenoura;
let imgToca;

function preload() {
  // Se você tiver imagens para cenoura ou toca, carregue-as aqui.
  // Exemplo:
  // imgCenoura = loadImage('assets/cenoura.png');
  // imgToca = loadImage('assets/toca.png');
}

function setup() {
  createCanvas(800, 600);
  fazendeiro = new Fazendeiro();
  coelho = new Coelho();
  toca = createVector(width - 50, height - 50); // Posição da toca
  tempoInicio = millis(); // Guarda o tempo de início do jogo

  // Gera algumas cenouras iniciais
  for (let i = 0; i < 5; i++) {
    cenouras.push(new Cenoura());
  }
}

function draw() {
  background(124, 252, 0); // Cor de grama

  if (!jogoAcabou) {
    // Desenha e atualiza fazendeiro
    fazendeiro.show();
    fazendeiro.move();

    // Desenha e atualiza coelho
    coelho.show();
    coelho.move();

    // Desenha cenouras e verifica interações
    for (let i = cenouras.length - 1; i >= 0; i--) {
      cenouras[i].show();

      // Fazendeiro pega a cenoura
      if (fazendeiro.pegaCenoura(cenouras[i])) {
        pontuacao++;
        cenouras.splice(i, 1); // Remove a cenoura
        gerarNovaCenoura();
      }

      // Coelho pega a cenoura
      if (coelho.pegaCenoura(cenouras[i])) {
        cenourasPerdidas++;
        cenouras.splice(i, 1); // Remove a cenoura
        gerarNovaCenoura();
      }
    }

    // Desenha a toca
    fill(100, 50, 0);
    ellipse(toca.x, toca.y, 40, 40);
    fill(255);
    textSize(16);
    textAlign(LEFT, BASELINE); // Volta para alinhamento padrão para textos de placar
    text("Toca", toca.x - 15, toca.y + 5);


    // Exibe pontuação e cenouras perdidas
    fill(0);
    textSize(24);
    text("Pontuação: " + pontuacao, 10, 30);
    text("Cenouras Perdidas: " + cenourasPerdidas + "/" + maxCenourasPerdidas, 10, 60);
    // NOVA LINHA AQUI: Contador de cenouras para vencer
    text("Cenouras para Vencer: " + (metaCenouras - pontuacao) + "/" + metaCenouras, 10, 90);


    // Exibe tempo restante
    let tempoDecorrido = (millis() - tempoInicio) / 1000;
    let tempoRestante = floor(tempoLimite - tempoDecorrido);
    text("Tempo: " + tempoRestante + "s", width - 150, 30);

    // Verifica condições de fim de jogo (ATUALIZADO com a condição de vitória)
    if (cenourasPerdidas >= maxCenourasPerdidas || tempoRestante <= 0 || pontuacao >= metaCenouras) {
      jogoAcabou = true;
    }
  } else {
    // Tela de fim de jogo
    fill(0);
    textSize(48);
    textAlign(CENTER, CENTER); // Alinha o texto do fim de jogo no centro
    text("FIM DE JOGO!", width / 2, height / 2 - 50);
    textSize(32);
    text("Pontuação Final: " + pontuacao, width / 2, height / 2);

    // Condições de vitória/derrota (ATUALIZADO para incluir a vitória)
    if (pontuacao >= metaCenouras) {
        textSize(24);
        text("Parabéns! Você coletou todas as cenouras!", width / 2, height / 2 + 50);
    } else if (cenourasPerdidas >= maxCenourasPerdidas) {
        textSize(24);
        text("O coelho comeu muitas cenouras!", width / 2, height / 2 + 50);
    } else if (tempoRestante <= 0) {
        textSize(24);
        text("O tempo acabou!", width / 2, height / 2 + 50);
    }

    textSize(20);
    text("Pressione 'R' para jogar novamente", width / 2, height / 2 + 100);
  }
}

function keyPressed() {
  if (jogoAcabou && (key === 'r' || key === 'R')) {
    resetGame();
  }
}

function resetGame() {
  pontuacao = 0;
  cenourasPerdidas = 0;
  cenouras = [];
  tempoInicio = millis();
  jogoAcabou = false;
  fazendeiro = new Fazendeiro(); // Reinicia a posição do fazendeiro
  coelho = new Coelho(); // Reinicia a posição do coelho
  for (let i = 0; i < 5; i++) {
    cenouras.push(new Cenoura());
  }
}

function gerarNovaCenoura() {
  cenouras.push(new Cenoura());
}

// Classe Fazendeiro
class Fazendeiro {
  constructor() {
    this.x = width / 2;
    this.y = height - 50;
    this.size = 40; // O tamanho do emoji será baseado nisso
    this.speed = 5;
  }

  show() {
    textSize(this.size); // Define o tamanho do texto (emoji)
    textAlign(CENTER, CENTER); // Centraliza o emoji nas coordenadas x, y
    text("👨‍🌾", this.x, this.y); // O emoji do fazendeiro
  }

  move() {
    if (keyIsDown(LEFT_ARROW)) {
      this.x -= this.speed;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      this.x += this.speed;
    }
    if (keyIsDown(UP_ARROW)) {
      this.y -= this.speed;
    }
    if (keyIsDown(DOWN_ARROW)) {
      this.y += this.speed;
    }

    // Limites da tela
    this.x = constrain(this.x, this.size / 2, width - this.size / 2);
    this.y = constrain(this.y, this.size / 2, height - this.size / 2);
  }

  pegaCenoura(cenoura) {
    let d = dist(this.x, this.y, cenoura.x, cenoura.y);
    // Ajuste de colisão para emojis, pois o "tamanho" visual pode ser diferente
    // Pode ser necessário ajustar o 0.6 ou 0.7 para melhor precisão
    return d < (this.size * 0.6) + (cenoura.size * 0.6);
  }
}

// Classe Coelho
class Coelho {
  constructor() {
    this.x = width / 2;
    this.y = 50;
    this.size = 30; // O tamanho do emoji será baseado nisso
    this.speed = 1;
    this.targetCenoura = null; // Cenoura que o coelho está perseguindo
  }

  show() {
    textSize(this.size * 1.2); // Um pouco maior para o coelho, ajuste se necessário
    textAlign(CENTER, CENTER); // Centraliza o emoji nas coordenadas x, y
    text("🐰", this.x, this.y); // O emoji do coelho
  }

  move() {
    if (this.targetCenoura && cenouras.includes(this.targetCenoura)) {
      // Move em direção à cenoura alvo
      let angle = atan2(this.targetCenoura.y - this.y, this.targetCenoura.x - this.x);
      this.x += cos(angle) * this.speed;
      this.y += sin(angle) * this.speed;
    } else {
      // Se não tem alvo ou alvo foi pego, encontra a cenoura mais próxima
      this.targetCenoura = this.findNearestCenoura();
      if (!this.targetCenoura) {
        // Se não houver cenouras, move-se aleatoriamente
        this.x += random(-this.speed, this.speed);
        this.y += random(-this.speed, this.speed);
      }
    }

    // Limites da tela
    this.x = constrain(this.x, this.size / 2, width - this.size / 2);
    this.y = constrain(this.y, this.size / 2, height - this.size / 2);
  }

  findNearestCenoura() {
    let nearest = null;
    let minDist = Infinity;
    for (let cenoura of cenouras) {
      let d = dist(this.x, this.y, cenoura.x, cenoura.y);
      if (d < minDist) {
        minDist = d;
        nearest = cenoura;
      }
    }
    return nearest;
  }

  pegaCenoura(cenoura) {
    let d = dist(this.x, this.y, cenoura.x, cenoura.y);
    // Ajuste de colisão para emojis
    return d < (this.size * 0.6) + (cenoura.size * 0.6);
  }
}

// Classe Cenoura
class Cenoura {
  constructor() {
    this.x = random(50, width - 50);
    this.y = random(50, height - 100); // Evita a área da toca
    this.size = 20;
  }

  show() {
    if (imgCenoura) {
      image(imgCenoura, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
    } else {
      fill(255, 140, 0); // Laranja
      ellipse(this.x, this.y, this.size, this.size * 1.5); // Forma de cenoura
      fill(0, 128, 0); // Verde
      rect(this.x - 2, this.y - this.size, 4, 10); // Folhas
    }
  }
}