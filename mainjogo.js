var canvas, ctx, ALTURA, LARGURA, frames=0, maxPulos=3;

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
    velocidade: 0,
    forcaDoPulo: 15, //na verdade ele pula 15-1.5=13.5 px
    qntPulos: 0,

    atualiza: function() {
        this.velocidade +=this.gravidade;
        this.y += this.velocidade; //aqui pula -15 em y
        if(this.y > chao.y - this.altura) {
            this.y = chao.y - this.altura; // ele está sempre indo pra baixo...
            this.qntPulos = 0; //...pela gravidade, ele tbm nao pode ocupar o lugar do chao
            // dois corpos nao ocupam o mesmo lugar no espaço
        }
    },
    pula: function() {
        if(this.qntPulos <maxPulos){
            this.velocidade = -this.forcaDoPulo;
            this.qntPulos++;
        }
    },
    desenha: function () {
        ctx.fillStyle = this.cor;
        ctx.fillRect(this.x, this.y, this.largura, this.altura);
    }
},

obstaculos = {
    _obs: [],
    _cores:["#ffbc1c","#ff1c1c","#ff85e1","#52a7ff","#78ff5d"],

    insere: function() {
        this._obs.push({ //adiciona obs
            x:200,
            largura: 30 + Math.floor(21*Math.random()),
            altura: 30 + Math.floor(120*Math.random()),
            cor: this._cores[Math.floor(5*Math.random())]
        })
    },

    atualiza: function() {

    },

    desenha: function() {
        tam = this._obs.length;
        for (var i = 0; i<tam; i++) { 
            var obs = this._obs[i]; 
            ctx.fillStyle = obs.cor;
            ctx.fillRect(obs.x, chao.y-obs.altura, obs.largura, obs.altura);
        }
    }
}; 

function clique(event) {
    bloco.pula();
    obstaculos.insere();
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
}
function desenha() {
    ctx.fillStyle = "#80daff";
    ctx.fillRect(0,0,LARGURA,ALTURA);

    chao.desenha();
    obstaculos.desenha();
    bloco.desenha();
}

//inicia o jogo
main();