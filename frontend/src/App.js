import React, { Component } from 'react';
import './App.css';
import './upload.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import './spinner.css';

class App extends Component {

  state = {
    selectedFile: null,
    startDate: '',
    endDate: '',
    errors: {
      file: false
    },
    loaderConvert: false,
    loaderCompare: false
  }

  handleFileChange = event => {
    this.setState({
      selectedFile: event.target.files[0]
    });
  }

  handleClickUpload = () => {
    const formData = new FormData();
    formData.append('csv', this.state.selectedFile);
    fetch('http://localhost:5000/api/upload', {
      method: 'POST',
      body: formData
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      if (data.success) {
        const fileNameUri = data.filename.replace('.', '_');
        this.setState({
          fileName: fileNameUri,
          errors: {
            file: false
          }
        });
      } else {
        this.setState({
          errors: {
            file: data.errors.file
          }
        });
      }
    })
    .catch(err => console.error('Error:', err))
  }
   
  handleDateChange(dateName, dateValue) {
    let { startDate, endDate } = this.state;
    if (dateName === 'startDateTime') {
      startDate = dateValue;
    } else {
      endDate = dateValue;
    }
    this.setState({
      startDate: startDate,
      endDate: endDate
    });
  }

  getExcell = async () => {
    const { startDate, endDate, fileName} = this.state;

    // Validate Front
    this.setState({ submitted: true });
    if (!(startDate && endDate)) {
      return;
    }

    // Loader consulting DB and Convert CSV to JSON
    this.setState({ loaderConvert: true });

    let startDateFormat = moment(startDate).format('DD-MM-YYYY');
    let endDateFormat = moment(endDate).format('DD-MM-YYYY');
    var endDateFormatTime = moment(endDate, "HH:mm:ss").format("hh:mm:ss");

    await fetch(`http://localhost:5000/api/logs/${startDateFormat}_05:00:00/${endDateFormat}_${endDateFormatTime}/${fileName}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
      })
      .then(res => {
        this.setState({
          loaderConvert: false,
          loaderCompare: true
        })
        return res.json()
      })
      .then(data => {
        console.log(data);
        if (data.success) {
          this.setState({
            dataSource: data.excelMaster,
            loaderCompare: false
          });
          this.exportAsExcelFile(this.state.dataSource);
        } else {
          this.setState({
            errors: {
              startDate: data.errors.startDate,
              endDate: data.errors.endDate
            }
          });
        }
      }).catch(err => console.log(`Error ${err}`));
  }

  exportAsExcelFile = dataSource => {
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_EXTENSION = '.csv';

    const worksheet = XLSX.utils.json_to_sheet(dataSource);
    const workbook = { Sheets: { 'FEE': worksheet }, SheetNames: ['FEE'] };
    const excelBuffer = XLSX.write(workbook, { bookType: 'csv', type: 'array' });

    const data = new Blob([excelBuffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, 'Reporte_Logs_' + moment().format('DD-MM-YYYY') + EXCEL_EXTENSION);
  }

  render() {
    const { errors, startDate, endDate, submitted, loaderCompare, loaderConvert } = this.state;
    
    let result;
    if (loaderConvert) {
      result = <div className="loader-convert">
                <div className="spinner">
                  <div className="rect1"></div>
                  <div className="rect2"></div>
                  <div className="rect3"></div>
                  <div className="rect4"></div>
                  <div className="rect5"></div>
                </div>
                <h3>
                  <span>3</span>
                  Convirting CSV to JSON and consulting MongoDB
                </h3>
              </div>
    } else if (loaderCompare) {
      result = <div className="loader-convert">
                <div className="spinner">
                  <div className="rect1"></div>
                  <div className="rect2"></div>
                  <div className="rect3"></div>
                  <div className="rect4"></div>
                  <div className="rect5"></div>
                </div>
                <h3>
                  <span>4</span>
                  Comparing JSON and Generating Excel File Report.
                </h3>
              </div>
    }

    return (
      <div className="container-report">

        <div className="row flex-column justify-content-center align-items-center upload">
          <div className="form-group files">
            <label>
              <span>1</span>
              Upload Your File CSV
            </label>
            <input 
              type="file" 
              className={`form-center
                ${ errors.file
                  ? 'is-invalid-file'
                  : ''
                }
              `}
              onChange={this.handleFileChange} 
            />
          </div>
          
          { errors.file &&
            <span className="alert-error">
              {this.state.errors.file}
            </span>
          }

          <button 
            className="btn btn-s button-file"
            onClick={this.handleClickUpload}
            style={{ display: this.state.selectedFile ? 'block' : 'none' }}
          >
            Upload
          </button>
        </div>

        <div 
          style={{display: this.state.fileName ? 'block' : 'none'}}
          className="title-range-date">
          <label>
            <span>2</span>
            Select Date Range
          </label>
        </div>

        <div
          style={{display: this.state.fileName ? 'block' : 'none'}}
          className="wrapper-inputs">
          <DatePicker
            id="start-date-time"
            name="startDateTime"
            className={`form-control input-date
              ${ (submitted && !startDate) || errors.startDate
                ? 'is-invalid'
                : ''
              }`}
            selected={this.state.startDate}
            value={this.state.startDate}
            onChange={date => this.handleDateChange('startDateTime', date)}
            placeholderText="Choose Start Date"
          />
          <DatePicker
            id="end-date-time"
            name="endDateTime"
            className={`form-control input-date
              ${ (submitted && !endDate) || errors.endDate
                ? 'is-invalid'
                : ''
              }`}
            selected={this.state.endDate}
            value={this.state.endDate}
            onChange={date => this.handleDateChange('endDateTime', date)}
            placeholderText="Choose End Date"
          /> 
          <button onClick={this.getExcell}>
            Generate Excel
          </button>
        </div>

        <div className="loader-convert">
          {
            result
          }

        </div>

      </div>
    );
  }
}

export default App;
