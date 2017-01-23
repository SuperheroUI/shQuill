import React from 'react'
import ReactDOM from 'react-dom';
import ShQuill from '../bin/sh-quill'

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            reason: '<div>first</div>'
        };


    }
    render() {
        return (
            <div className="">
            <div className="example">
                <ShQuill className="" value={this.state.reason}/>
            </div>
            <button>test</button>
            </div>
        )
    }
}

ReactDOM.render(<App/>, document.getElementById('app'));