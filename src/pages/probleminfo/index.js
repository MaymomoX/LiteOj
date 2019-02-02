import React, {Component} from 'react';
import {connect} from 'dva';
import { Col, Row, Select } from 'antd';
import axios from 'axios';
import { PROBLEMINFO_URL } from '@/api/api';
import ReactMarkdown from 'react-markdown';
import MonacoEditor from 'react-monaco-editor';
const Option = Select.Option;
// or import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
// if shipping only a subset of the features & languages is desired
class ProblemInfo extends Component {
  constructor(){
    super();
    this.state={
      loading:false,
      name:"",
      author:"",
      submit:"",
      solved:"",
      timelimit:1000,
      memorylimit:256,
      description:"",
      input:"",
      output:"",
      simple_input:"",
      simple_output:"",
    }
  }

  componentDidMount() {
    this.fetchProblemInfo({pid: parseInt(1)});
  }
  fetchProblemInfo=(params={})=>{
    this.setState({loading:true});
    axios.get(PROBLEMINFO_URL+"/"+params.pid).then(response=>{
      if(response.data.hasOwnProperty("errCode")&&response.data.errCode===0)
      {
        let msg=JSON.parse(window.atob(response.data.message));
        this.setState({
          loading:false,
          name:msg.name,
          author:msg.audio,
          submit:msg.submit,
          solved:msg.solved,
          timelimit:msg.timelimit,
          memorylimit:msg.memorylimit,
          description:msg.description,
          input:msg.input,
          output:msg.output,
          simple_input:msg.simple_input,
          simple_output:msg.simple_output,
        });
      }else {
        alert("Error");
      }
    }).catch((e)=> {
      console.log(e);
      alert("No Info")
    });
  };
  render() {
    return (
      <layout>
        <row>
          <div style={{textAlign:"center",fontSize:"30px"}}>
          {this.state.name}
          </div>
        </row>
        <row>
          <ReactMarkdown source={"## Description"}/>
          <ReactMarkdown source={this.state.description}/>
        </row>
        <row>
          <ReactMarkdown source={"## Input"}/>
          <ReactMarkdown source={this.state.input}/>
        </row>
        <row>
          <ReactMarkdown source={"## Output"}/>
          <ReactMarkdown source={this.state.output}/>
        </row>
        <row>
          <ReactMarkdown source={"## Example Input"}/>
          <ReactMarkdown source={this.state.simple_input}/>
        </row>
        <row>
          <ReactMarkdown source={"## Example Output"}/>
          <ReactMarkdown source={this.state.simple_output}/>
        </row>
      </layout>
    );
  }
}
class SubmitForm extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      code: '// type your code...',
      language:'cpp',
      language_post:'1',
      theme:'vs-dark',
    }
  }
  editorDidMount(editor, monaco) {
    console.log('editorDidMount', editor);
    editor.focus();
  }
  onChange(newValue, e) {
    console.log('onChange', newValue, e);
  }
  getLanguage(value){
    switch (value) {
      case 1:
      case 2:
      case 3:
        return 'cpp';
      default:
        return 'java';

    }
  }
  onLanguageChange(newValue)
  {
    this.setState({language:newValue,language_post:this.getLanguage(newValue)})
  }
  onThemeChange(newValue)
  {
    console.log(newValue);
    this.setState({theme:newValue})
  }
  render() {
    const code = this.state.code;
    const options = {
      selectOnLineNumbers: true
    };
    return (
      <layout>
        <row >
          Language:
          <Select defaultValue={"1"} onChange={this.onLanguageChange.bind(this)}>
            <Option key={"1"} value={"1"}>C</Option>
            <Option key={"2"} value={"2"}>C++</Option>
          </Select>
            Themes:
          <Select defaultValue={"vs-dark"} onChange={this.onThemeChange.bind(this)}>
            <Option key={"1"} value={"vs"}>Visual Studio</Option>
            <Option key={"2"} value={"vs-dark"}>Visual Studio Dark</Option>
            <Option key={"3"} value={"hc-black"}>High Contrast Dark</Option>
          </Select>
        </row>
        <row>
        <MonacoEditor
          width="800"
          height={document.body.clientHeight}
          language={this.state.language}
          theme={this.state.theme}
          value={code}
          options={options}
          onChange={::this.onChange}
          editorDidMount={::this.editorDidMount}
        />
        </row>
      </layout>
    );
  }
}

function ProblemInfos(state) {
  return (
    <Row>
      <Col md={12}>
        <ProblemInfo/>
      </Col>
      <Col md={12}>
        <SubmitForm/>
      </Col>
    </Row>
  );
}

export default connect(states => {
  return {...states};
})(ProblemInfos);
