var canvas, ctx, ALTURA, LARGURA, frames=0, maxPulos=3, velocidade = 6,//vel em x
estadoAtual,record,

estados = {
    JOGAR:0,
    JOGANDO:1,
    PERDEU:2
},

chao = {
    y: 550,
    altura: 50,
    cor: "#aa2323",

    desenha: function () {
        ctx.fillStyle = this.cor;
        ctx.fillRect(0, this.y, LARGURA, this.altura);
    }
},
bloco = {
    x:50,
    y:0, //comeca no 0 para fazer o efeito do boquinho caindo
    altura:50,
    largura:50,
    cor:"#ff4e4e",
    gravidade: 1.5, //fixo
    velocidade: 0, // velocidade do pulo!
    forcaDoPulo: 24, //na verdade ele pula 15-1.5=13.5 px
    qntPulos: 0,
    score: 0, //para incializar é com ":"

    atualiza: function() {
        this.velocidade +=this.gravidade;
        this.y += this.velocidade; //aqui pula -15 em y, MUDA O Y!
        if(this.y > chao.y - this.altura && estadoAtual!=estados.PERDEU) {//faz o bloquinho cair qnd perde
            this.y = chao.y - this.altura; // ele está sempre indo pra baixo...
            this.qntPulos = 0; //...pela gravidade, ele tbm nao pode ocupar o lugar do chao
            this.velocidade = 0;// dois corpos nao ocupam o mesmo lugar no espaço
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
        this.score = 0;
    },
    desenha: function () {
        ctx.fillStyle = this.cor;
        ctx.fillRect(this.x, this.y, this.largura, this.altura);
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

    canvas = document.createElement("canvas");
    canvas.width=LARGURA;
    canvas.height=ALTURA;
    canvas.style.border="1px solid #000";

    ctx = canvas.getContext("2d"); // contexto
    document.getElementById("mygame").appendChild(canvas);

    document.addEventListener("mousedown", clique); //mouseover, click, mouseout
    // keydown, keyup, keypress

    record = localStorage.getItem("record"); //se encontrar usa, else record=null
    if (record==null)
        record = 0;
    estadoAtual = estados.JOGAR;
    roda();
}

function roda() {
    atualiza();
    desenha();

    window.requestAnimationFrame(roda); //gasta menos processamento
}
function atualiza() {
    frames++;
    bloco.atualiza();
    if (estadoAtual == estados.JOGANDO)
        obstaculos.atualiza();
}
function desenha() {
    ctx.fillStyle = "#80daff";
    ctx.fillRect(0,0,LARGURA,ALTURA);

    ctx.fillStyle = "#fff";
    ctx.font = "50px Arial";
    ctx.fillText(bloco.score, 30, 30+38); //altura do digito sempre igual


    if (estadoAtual ==estados.JOGAR) {
        ctx.fillStyle = "green";
        ctx.fillRect(LARGURA/2 -50, ALTURA/2-50, 100, 100);
    }
    else if (estadoAtual==estados.PERDEU) {
        ctx.fillStyle = "red";
        ctx.fillRect(LARGURA/2 -50, ALTURA/2-50, 100, 100);

        ctx.save();
        ctx.translate(LARGURA/2, ALTURA/2); //muda a referencia de onde comeca a desenhar
        ctx.fillStyle = "#fff";
        if (bloco.score<10)
            ctx.fillText(bloco.score, -13, 12); //um digito tem 26x38 (largura/altura)
        else if (bloco.score<100)
            ctx.fillText(bloco.score, -13-13, 12);
        else
            ctx.fillText(bloco.score, -13*3, 12); //a fonte nao perece arial, y=12 ficou bom
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