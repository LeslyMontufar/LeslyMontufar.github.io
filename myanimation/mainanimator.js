var canvas, ctx, ALTURA=300, LARGURA,  VELOCIDADE = 6, maxPulos=3, //vel em x

chao = {
    altura: 50,
    y: ALTURA-50,
    cor: "#6A332E",

    desenha: function () {
        ctx.fillStyle = this.cor;
        ctx.fillRect(0, this.y, LARGURA, this.altura);
    }
},


bloco = {
    x:50,
    y:0, //comeca no 0 para fazer o efeito do boquinho caindo
    altura: 50,
    largura: 50,
    gravidade: 1.5, //fixo
    velocidade: 0, // velocidade do pulo! (eixo y)
    forcaDoPulo: 24, //na verdade ele pula 15-1.5=13.5 px
    qntPulos: 0,
    cor: "#e74c3c",
    KP: 0.01,

    atualiza: function() {
        this.velocidade +=this.gravidade;
        this.y += this.velocidade; //aqui pula -15 em y, MUDA O Y!
        if(this.y > chao.y - this.altura) {
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
    parafrente: function() {
        this.x += this.KP*(LARGURA-this.x);
        if(this.x>LARGURA-this.largura)
            this.x=LARGURA-this.largura;
    },

    reset: function() {
        this.velocidade = 0;
        this.y = 0; // para começar lá de cima de novo
        if (this.score > record) {
            localStorage.setItem("record", this.score);
            record = this.score;
        }
        VELOCIDADE = 6;
    },
    desenha: function () {
        ctx.fillStyle = "#c0392b";
        ctx.fillRect(this.x, this.y,this.largura,this.altura);

        ctx.beginPath();
        ctx.arc(this.x+this.largura/2, this.y+this.altura/2, this.altura/2, 0, 2 * Math.PI, false);
        ctx.fillStyle = this.cor;
        ctx.fill();
    }
};

function clique(event) {
    bloco.x=50;
}
function main() {
    // ALTURA=300; //FIXA
    LARGURA=window.innerWidth;

    if (LARGURA>=500) {
        LARGURA=600;
    }

    canvas = document.getElementById("canvas");
    canvas.width=LARGURA;
    canvas.height=ALTURA;
    canvas.style.border="1px solid #000";
    ctx = canvas.getContext("2d"); 

    document.addEventListener("mousedown", clique);

    roda();
}

function roda() {
    atualiza();
    desenha();

    window.requestAnimationFrame(roda); //gasta menos processamento
}
function atualiza() {
    bloco.atualiza();
    bloco.parafrente();
}
function desenha() { 
    ctx.fillStyle = "#80daff";
    ctx.fillRect(0,0,LARGURA,ALTURA);
    
    bloco.desenha();
    chao.desenha();
}

//inicia a animacao
main();