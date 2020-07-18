import React, {Component} from 'react';
import {Col, Row, Container, Button} from 'reactstrap';
import Header from '../header';
import RandomChar from '../randomChar';
import ItemList from '../itemList';
import CharDetails from '../charDetails';


export default class App extends Component {

    state = {
        randomChar: true,
        selectedChar: 130
    }

    onCharSelected = (id) => {
        this.setState({
            selectedChar: id
        })
    }

    checkToggle = () => {
        if (this.state.randomChar) {
            this.setState({randomChar: false})
        } else {
            this.setState({randomChar: true})
        }
    }

    render() {

        const randomCharVisibility = this.state.randomChar ? <RandomChar/> : null;

        return (
            <> 
                <Container>
                    <Header />
                </Container>
                <Container>
                    <Row>
                        <Col lg={{size: 5, offset: 0}}>
                            {randomCharVisibility}
                        </Col>
                    </Row>
                    <Button color="primary" onClick={()=> this.checkToggle()}>Toggle</Button>
                    <Row>
                        <Col md='6'>
                            <ItemList onCharSelected={this.onCharSelected}/>
                        </Col>
                        <Col md='6'>
                            <CharDetails charId={this.state.selectedChar}/>
                        </Col>
                    </Row>
                </Container>
            </>
        );
    }

};


