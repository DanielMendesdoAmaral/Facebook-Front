import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InfiniteScroll from 'react-infinite-scroll-component';
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import {useHistory} from "react-router-dom";

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

function ScrollInfinito() {
    const classes = useStyles();

    const history = useHistory();

    const [data, setData] = useState({});

    useEffect(() => {
        listar();
    }, []);

    const listar = async (page = 1) => {
        console.log(page)
        const response = await fetch(`http://localhost:5000/postagem/page=${page}`)
        const dados = await response.json();
        
        if(page===1)
            setData(dados.dados);
        else {
            let unifier = data;
            unifier.postagens = unifier.postagens.concat(dados.dados.postagens);
            setData(unifier);
            history.push("scroll-infinito")
        }
    }

    return (
        <Container>
            <h1>Postagens</h1>
            {
                data === undefined || data.postagens === undefined
                ?
                <h1>LOADING...</h1>
                :
                <InfiniteScroll
                    dataLength={data.postagens.length}
                    next={() => listar((data.postagens.length/10)+1)}
                    hasMore={data.postagens.length < data.quantidadePostagens}
                    loader={<h4>Loading...</h4>}
                    endMessage={<h4>Acabou!</h4>}
                >
                    {
                        data.postagens.map((postagem, index) => {
                            return (
                                <div className={classes.cardPostagem} key={index}>
                                    <Typography variant="h5" color="textPrimary" component="p">
                                        {postagem.texto}
                                    </Typography>
                                </div>
                            )
                        })
                    }
                </InfiniteScroll>
            }
        </Container>
    );
}

export default ScrollInfinito;