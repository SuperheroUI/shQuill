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
            <div className="example">
                <ShQuill className="sm" value={this.state.reason}/>
            </div>
        )
    }
}

ReactDOM.render(<App/>, document.getElementById('app'));