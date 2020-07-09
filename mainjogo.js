var canvas, ctx, ALTURA, LARGURA, frames=0;

chao = {
    y: 550,
    altura: 50,
    cor: "#ffdf70",

    desenha: function () {
        ctx.fillStyle = this.cor;
        ctx.fillRect(0, this.y, LARGURA, this.altura);
    }
},
bloco = {
    x:50,
    y:0,
    altura:50,
    largura:50,
    cor:"#ff4e4e",
    gravidade: 1.5,
    velocidade: 0,
    forcaDoPulo: 15,
    qntPulos: 0,

    desenha: function () {
        ctx.fillStyle = this.cor;
        ctx.fillRect(this.x, this.y, this.largura, this.altura);
    }
};

function clique(event) {
    // alert("clicou")
}
function main() {
    ALTURA=window.innerHeight;
    LARGURA=window.innerWidth;

    if (LARGURA>=500) { //width:30em
        LARGURA=500;
        ALTURA=500;
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
}
function desenha() {
    ctx.fillStyle = "#50beff";
    ctx.fillRect(0,0,LARGURA,ALTURA);

    chao.desenha();
    bloco.desenha();
}

//inicia o jogo
main();