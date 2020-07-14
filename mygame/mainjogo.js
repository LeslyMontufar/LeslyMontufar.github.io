var canvas, ctx, ALTURA, LARGURA, maxPulos=3, velocidade = 6,//vel em x
estadoAtual,record,img,

estados = {
    JOGAR:0,
    JOGANDO:1,
    PERDEU:2
},

chao = {
    y: 550,
    altura: 50,
    cor: "#6A332E",

    desenha: function () {
        ctx.fillStyle = this.cor;
        ctx.fillRect(0, this.y, LARGURA, this.altura);
    }
},

background = {
    x:0,
    largura: bg.largura,

    atualiza: function() {
        if (estadoAtual == estados.JOGANDO)
            this.x -= velocidade/60;    
        if (this.x <LARGURA-bg.largura)
            this.x = 0;
    },

    desenha: function() {
        bg.desenha(this.x, 0);
    }
},
bloco = {
    x:50,
    y:0, //comeca no 0 para fazer o efeito do boquinho caindo
    altura: caracter.altura,
    largura: caracter.largura,
    gravidade: 1.5, //fixo
    velocidade: 0, // velocidade do pulo!
    forcaDoPulo: 24, //na verdade ele pula 15-1.5=13.5 px
    qntPulos: 0,
    score: 0, //para incializar é com ":"
    tempoMovimenta: 5,

    atualiza: function() {
        this.velocidade +=this.gravidade;
        this.y += this.velocidade; //aqui pula -15 em y, MUDA O Y!
        if(this.y > chao.y - this.altura && estadoAtual!=estados.PERDEU) {//faz o bloquinho cair qnd perde
            this.y = chao.y - this.altura; // ele está sempre indo pra baixo...
            this.qntPulos = 0; //...pela gravidade, ele tbm nao pode ocupar o lugar do chao
            this.velocidade = 0;// dois corpos nao ocupam o mesmo lugar no espaço
        }

        if (estadoAtual == estados.JOGANDO){
            if(!this.tempoMovimenta) {
                caracter.movimenta();
                this.tempoMovimenta = 5;
            }
            else
                this.tempoMovimenta--;
        }
    },
    pula: function() {
        if(this.qntPulos <maxPulos){
            this.velocidade = -this.forcaDoPulo;
            this.qntPulos++;
        }
    },
    reset: function() {
        this.velocidade = 0;
        this.y = 0;
        if (this.score > record) {
            localStorage.setItem("record", this.score);
            record = this.score;
        }
        this.score = 0;
    },
    desenha: function () {
        caracter.desenha(this.x, this.y);
    }
},

obstaculos = {
    _obs: [],
    _cores:["#ffbc1c","#ff1c1c","#ff85e1","#52a7ff","#78ff5d"],
    tempoInsere: 0,

    insere: function() {
        this._obs.push({ //adiciona obs
            x:LARGURA,
            largura: 50,
            // largura: 30 + Math.floor(20*Math.random()),
            altura: 30 + Math.floor(120*Math.random()),
            cor: this._cores[Math.floor(5*Math.random())]
        });

        this.tempoInsere = 30 + Math.floor(30*Math.random());
    },

    atualiza: function() {
        if (!this.tempoInsere)
            this.insere(); //cria outro tempo de inserir
        else
            this.tempoInsere--;

        for (var i = 0; i<this._obs.length; i++) { 
            var obs = this._obs[i]; 
            obs.x-=velocidade;

            if (bloco.x<obs.x+obs.largura && bloco.x+bloco.largura>=obs.x && bloco.y+bloco.altura>=chao.y - obs.altura) { //antes de tirar o obstaculo da tela
                estadoAtual = estados.PERDEU;
            }
            else if (obs.x==0){ //antes do bloco desaparecer ele sempre passa por x igual a 0, logo score++
                bloco.score++;
            }
            else if (obs.x <=-obs.largura) {
                this._obs.splice(i, 1); //tira uma posição a partir do i
            }
        }
        
    },

    limpa: function() {
        this._obs = [];
    },

    desenha: function() {
        for (var i = 0; i<this._obs.length; i++) { 
            var obs = this._obs[i]; 
            ctx.fillStyle = obs.cor;
            ctx.fillRect(obs.x, chao.y-obs.altura, obs.largura, obs.altura);
            // ctx.fillStyle = "black";
            // ctx.strokeRect(obs.x, chao.y-obs.altura, obs.largura, obs.altura);
        }
    }
}; 

function clique(event) {
    if (estadoAtual == estados.JOGANDO) {
        bloco.pula();
    }
    else if (estadoAtual == estados.JOGAR) {
        estadoAtual = estados.JOGANDO;
    }
    else if (estadoAtual == estados.PERDEU && bloco.y >2*bloco.altura){
        estadoAtual = estados.JOGAR;
        obstaculos.limpa();
        bloco.reset();
    }
}
function main() {
    ALTURA=window.innerHeight;
    LARGURA=window.innerWidth;

    if (LARGURA>=500) { //width:30em
        LARGURA=600;
        ALTURA=600;
    }

    canvas = document.getElementById("canvas");
    canvas.width=LARGURA;
    canvas.height=ALTURA;
    canvas.style.border="1px solid #000";
    ctx = canvas.getContext("2d"); // contexto

    document.addEventListener("mousedown", clique); //mouseover, click, mouseout
    // keydown, keyup, keypress

    estadoAtual = estados.JOGAR;

    record = localStorage.getItem("record"); //se encontrar usa, else record=null
    if (record==null)
        record = 0;
    
    img = new Image();
    img.src = "img.png";

    roda();
}

function roda() {
    atualiza();
    desenha();

    window.requestAnimationFrame(roda); //gasta menos processamento
}
function atualiza() {
    background.atualiza();
    if (estadoAtual == estados.JOGANDO)
        obstaculos.atualiza();
    bloco.atualiza();
}
function desenha() {
    //backgroud aparece primeiro, as letras por cima ...
    background.desenha();

    ctx.fillStyle = "#fff";
    ctx.font = "50px Arial";
    ctx.fillText(bloco.score, 30, 30+38); //altura do digito sempre igual


    if (estadoAtual==estados.JOGAR) {
        play.desenha(LARGURA/2 - play.largura/2, ALTURA/2- play.altura/2);
    }
    else if (estadoAtual==estados.PERDEU) {
        ctx.save();
        ctx.translate(LARGURA/2, ALTURA/2); //economiza digitar LARGURA/2, ALTURA/2 ...
        if (bloco.score>record) {
            novo.desenha(-resultados.largura/2-30, -resultados.altura/2);
            bonecoRasteira.desenha(-bonecoRasteira.largura/2,-bonecoRasteira.altura/2-110);
            ctx.fillStyle = "#fff";
            if (bloco.score <10)
                ctx.fillText(bloco.score, -13, 34);
            else if (bloco.score<100)
                ctx.fillText(bloco.score, -13*2, 34);
            else
                ctx.fillText(bloco.score, -13*3, 34);
        }
        else { //nao é record
            resultados.desenha(-resultados.largura/2-30,-resultados.altura/2);
            bonecoCaiu.desenha(-bonecoCaiu.largura/2,-bonecoCaiu.altura/2-95);
            ctx.fillStyle = "#fff";
            ctx.fillText(bloco.score, 70, -26);
            ctx.fillText(record, 70,32);
        }
        ctx.restore();
    }
    else if (estadoAtual==estados.JOGANDO) {
        obstaculos.desenha();
    }

    chao.desenha();
    bloco.desenha();
}

//inicia o jogo
main();