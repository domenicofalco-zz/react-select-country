// dependencies
import React from 'react';
import ReactDOM from 'react-dom';

// react Add-Ons module
import enhanceWithClickOutside from 'react-click-outside';

// country list
import countryList from './list-of-country';

class SelectCountry extends React.Component {

  constructor(props) {
    super(props);

    this.autoComplete = this.autoComplete.bind(this);
    this.dropDownToggle = this.dropDownToggle.bind(this);
    this.dropDownOpen = this.dropDownOpen.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);

    this.defaultCountry = 'IT',
    this.fullCountryList = countryList;

    this.state = {
      isShown: false,
      countryList: this.fullCountryList,
      countryName: '',
      countryCode: '',
      itemCounter: 0
    }
  }

  selectOption(country) {
    this.lastCountryCode = country[0];
    this.lastCountryName = country[1];

    this.dropDownClose();

    this.setState({
      countryCode: this.lastCountryCode,
      countryName: this.lastCountryName
    }, () => {
      // here may fit a fn to dispatch the country code (or whatever parameter you need from the select) to a parent Component
      // eg: this.props.dispatchSelectedCountry(this.state.countryCode)
    });
  }

  createOptions() {
    return this.state.countryList.map((country, i) => {
      let selectedClass = '';
      const { itemCounter } = this.state;
      const isTouch = Modernizr.touchevents;
      const isSelected = itemCounter === i;
      const countryCode = country[0];
      const countryName = country[1];
      const countryNativeName = country[2];
      const setReference = (item) => this.optionSelectedReference = item;

      if(isSelected && !isTouch) {
        this.optionSelectedAsArray = country;
        selectedClass = ' selected';
      }

      return (
        <li
          key={i}
          ref={(item) => !isTouch && isSelected ? setReference(item) : null}
          className={'select-country__item' + selectedClass}
          onMouseOver={() => !isTouch ? this.hoverList(i) : null}
        >
          <span className='select-country__item__wrap' onClick={() => this.selectOption(country)}>
            <i className={'country-flag flag-' + countryCode.toLowerCase()} />
            <i className='select-country__item__name'>{countryName} ({countryNativeName})</i>
          </span>
        </li>
      );

    });
  }

  hoverList(i) {
    this.setState({
      itemCounter: i
    });
  }

  autoComplete(e) {
    const { value } = e.target;

    let filteredCountryList = this.fullCountryList.filter((country, i) => {
      const countryName = country[1].toLowerCase();
      const countryNativeName = country[2].toLowerCase();
      return countryName.includes(value.toLowerCase()) || countryNativeName.includes(value.toLowerCase());
    });

    this.setState({
      countryName: value,
      countryList: filteredCountryList,
      itemCounter: 0,
      isShown: true
    });
  }

  dropDownToggle() {
    this.setState((prevState) => {
      return {
        isShown: !prevState.isShown,
        countryName: this.lastCountryName,
        countryCode: this.lastCountryCode,
      }
    });
  }

  dropDownOpen() {
    this.inputReference.focus();

    if(!this.state.isShown) {
      this.setState({
        isShown: true,
        countryName: '',
        countryCode: ''
      });
    }
  }

  dropDownClose() {
    if(this.state.isShown) {
      this.setState({
        isShown: false,
        countryList: this.fullCountryList,
        countryName: this.lastCountryName,
        countryCode: this.lastCountryCode,
        itemCounter: 0
      });
    }
  }

  onKeyDown(e) {
    const keyCode = e.keyCode || e.which;
    const { countryList, itemCounter } = this.state;

    if(!this.optionSelectedReference) return null;

    const elH = this.optionSelectedReference.getBoundingClientRect().height;
    const listH = this.listReference.getBoundingClientRect().height;

    switch(keyCode) {
        case 38: {
          // up
          if(itemCounter > 0) {
            this.setState({
              itemCounter: itemCounter - 1
            }, () => {

              if(this.optionSelectedReference.offsetTop < this.listReference.scrollTop) {
                this.listReference.scrollTop -= elH;
              }

            });
          }
        }
        break;

        case 40: {
          // down
          if(itemCounter < countryList.length - 1) {
            this.setState({
              itemCounter: itemCounter + 1
            }, () => {

              if((this.optionSelectedReference.offsetTop + elH) >= (this.listReference.scrollTop + listH)) {
                this.listReference.scrollTop += elH;
              }

            });
          }

        }
        break;

        case 13: {
          // enter
          e.preventDefault();
          this.selectOption(this.optionSelectedAsArray);
        }
        break;

        default: return null;
    }

  }

  // this is a react Add-Ons methods
  handleClickOutside() {
    this.dropDownClose();
  }

  componentWillMount() {
    const { countryList } = this.state;

    if(countryList.length) {
      const findDefaultCountry = (country) => {
        return country[0].toLowerCase() === this.defaultCountry.toLowerCase();
      }

      const country = countryList.find(findDefaultCountry);

      this.selectOption(country);
    }
  }

  render() {
    const { isShown, countryCode, countryName } = this.state;
    const optionList = this.createOptions();
    let status;

    if(optionList.length < 1) {
      status = <h1>no country available</h1>;
    } else {
      status = <h1>{`${this.lastCountryName} (${this.lastCountryCode})`}</h1>
    }

    return (
      <div
        className='select-country'
        onKeyDown={this.onKeyDown}
      >
        <input type='hidden' name='country-code' value={countryCode} />

        <span className='select-country__title'>Select country</span>

        <div className='select-country__combo'>
          <div className='select-country__selected' onClick={this.dropDownOpen}>
            <span
              onClick={this.dropDownToggle}
              className='select-country__selected__dropdown'
            >
              <i className={'country-flag flag-' + countryCode.toLowerCase()} />
            </span>
            <input
              ref={(input) => this.inputReference = input }
              type='text'
              className='select-country__selected__name'
              value={countryName}
              onChange={this.autoComplete}
            />
          </div>

          {isShown &&
            <ul
              ref={(ul) => this.listReference = ul}
              className='select-country__list'>
              {optionList}
            </ul>
          }

        </div>
        {status && status}
      </div>
    );
  }
};

const App = enhanceWithClickOutside(SelectCountry);

ReactDOM.render(<App />, document.getElementById('selectCountry'));
