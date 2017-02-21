import React from 'react'
import ReactDOM from 'react-dom';
import ShQuill from '../src/index'

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            reason: '<div>beginning text</div>'
        };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange() {
        this.setState({
            reason: `<ul>
                <li>one</li>
                <li>two</li>
                <li>three</li>
                <li>four</li>
                        </ul>`
        })
    }

    render() {
        return (
            <div className="">
                <div className="example">
                    <ShQuill value={this.state.reason} insertImageWithUrl={true}/>
                </div>
                <button onClick={this.handleChange}>test</button>
            </div>
        )
    }
}

ReactDOM.render(<App/>, document.getElementById('app'));