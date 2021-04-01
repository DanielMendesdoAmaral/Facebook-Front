import React, { useEffect, useState } from 'react';
import Container from '@material-ui/core/Container';
import Pagination from '@material-ui/lab/Pagination';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useHistory, useParams } from 'react-router';
import { Button } from '@material-ui/core';

const useStyles = makeStyles({
  input: {
    display: "flex",
    justifyContent: "center",
    margin: "50px 0"
  },
  cardPostagem: {
    border: "solid 1px #CCC",
    borderRadius: 10,
    margin: 50,
    padding: 20
  },
  cardComentario: {
    border: "solid 1px blue",
    borderRadius: 10,
    margin: "20px auto",
    padding: 20
  },
  lerMais: {
    color: "#777",
    cursor: "pointer"
  }
});

function Comentario({...params}) {
  const classes = useStyles();

  return (
    <Container className={classes.cardComentario}>
      <Typography variant="body1" color="textPrimary" component="p">
        {params.texto}
        {
          params.quantidadeCaracteres > params.texto.length && <span className={classes.lerMais} onClick={() => params.buscarMaisCaracteres(params.id, params.texto.length)}>... Ver mais</span>
        }
      </Typography>
    </Container>
  )
}

function Postagem({...params}) {
  const classes = useStyles();

  return (
    <div className={classes.cardPostagem}>
      <Typography variant="h5" color="textPrimary" component="p">
        {params.texto}
      </Typography>
      <h3 style={{textAlign: "center"}}>Comentários</h3>
      {
        params.comentarios.map((comentario, index) => {
          return (
            <div key={index}>
              <Comentario texto={comentario.texto} quantidadeCaracteres={comentario.quantidadeCaracteres} buscarMaisCaracteres={params.buscarMaisCaracteres} id={comentario.id}/>
              {/*Se estiver renderizando o último comentário, e a quantidade de comentários renderizados dessa postagem for menor que a quantidade de comentários dessa postagem disponível no banco de dados, ele renderiza um botão */
              (index+1===params.comentarios.length && params.comentarios.length < params.quantidadeComentarios) && <Button onClick={() => params.buscarMaisComentarios(params.idPostagem, params.comentarios.length)}>Ver mais</Button>}
            </div>
          )
        })
      }
    </div>
  )
}

function App() {
  const classes = useStyles();
  const history = useHistory();

  const [postagens, setPostagens] = useState([]);
  const [loading, setLoading] = useState(true);

  const {page} = useParams();
  const [palavrasChave, setPalavrasChave] = useState("");

  const buscarMaisComentarios = async (idPostagem, de) => {
    const response = await fetch(`http://localhost:5000/postagem/idPostagem=${idPostagem}&de=${de}`);
    const data = await response.json();
    
    let comentariosIncluidos = postagens;

    data.dados.map(c => comentariosIncluidos.postagens.find(p => p.id === idPostagem).comentarios.push(c));

    setPostagens(comentariosIncluidos);

    //O componente não estava atualizando e então não renderizava os novos comentários. Essa foi a solução que eu achei.
    history.push(`/postagens/page=${page}`);
  }

  const buscarMaisCaracteres = async (idComentario, de) => {
    const response = await fetch(`http://localhost:5000/comentario/idComentario=${idComentario}&de=${de}`)
    const data = await response.json();
    
    let caracteresIncluidos = postagens;

    caracteresIncluidos.postagens.map(p => {
      p.comentarios.map(c => {
        if (c.id === idComentario)
          c.texto += data.dados;
      });
    });

    setPostagens(caracteresIncluidos);

    history.push(`/postagens/page=${page}`);
  }

  useEffect(() => {
    listar();
  }, [palavrasChave, page]);

  const listar = async () => {
    setLoading(true);

    const response = await fetch(`http://localhost:5000/postagem/page=${page}${palavrasChave==="" ? "" : `?palavrasChave=${palavrasChave.replaceAll(" ", "%")}` }`)
    const data = await response.json();

    setPostagens(data.dados);

    setLoading(false);
  };

  return (
    <Container>

      <TextField className={classes.input} id="standard-basic" label="Palavras chave" value={palavrasChave} onChange={
        event => {
          history.push("/postagens/page=1")
          setPalavrasChave(event.target.value)
      }}/>
      <h1 style={{textAlign: "center", textDecoration: "underline"}}>Postagens</h1>

      {
        loading 
        
        ? 
        
        <CircularProgress/>

        :

        <>
          {
            postagens.postagens.map((postagem, index) => <Postagem idPostagem={postagem.id} texto={postagem.texto} quantidadeComentarios={postagem.quantidadeComentarios} comentarios={postagem.comentarios} key={index} buscarMaisComentarios={buscarMaisComentarios} buscarMaisCaracteres={buscarMaisCaracteres}/>)
          }
          <Pagination style={{display: "flex", justifyContent: "center", marginBottom: 25}} count={Math.ceil(postagens.quantidadePostagens/10)} page={Number(page)} onChange={
            (event, value) =>
              history.push(`/postagens/page=${value}`)
          }/>
        </>
      }
    </Container>
  );
}

export default App;