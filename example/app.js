import React from 'react'
import ReactDOM from 'react-dom';
import ShQuill from '../src/index'

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '<div>beginning text</div>'
        };

        this.handleChange = this.handleChange.bind(this);
        this.updateValue = this.updateValue.bind(this);
    }

    handleChange(value) {
        this.setState({
            value: value
        })
    }

    updateValue() {
        this.setState({
            value: `<ul>
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
                    <ShQuill
                      value={this.state.value}
                      onChange={this.handleChange}
                      config={{
                        insertImageWithUrl: true
                      }}
                      />
                </div>
                <button onClick={this.updateValue}>Update Value</button>
                <p>{this.state.value}</p>
            </div>
        )
    }
}

ReactDOM.render(<App/>, document.getElementById('app'));