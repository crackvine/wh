import { useState } from 'react';
import PropTypes from 'prop-types';

import readFileAsText from '../lib/readFileAsText';

const ProvisionItemsForm = ({ handleProvision }) => {
  const [targetFile, setTargetFile] = useState();
  const [isSelected, setIsSelected] = useState(false);
  const [parseError, setParseError] = useState(false);

  const handleOnChange = (event) => {
    setParseError(false);
    setIsSelected(true);
    setTargetFile(event.target.files[0]);
  };

  const handleOnSubmit = async (event) => {
    event.preventDefault();
    const fileContents = await readFileAsText(targetFile);
    try {
      const payload = JSON.parse(fileContents);
      handleProvision(payload);
    } catch (error) {
      setParseError(true);
    }
  };

  return (
    <form onSubmit={handleOnSubmit}>
      <h3>PROVISIONING</h3>
      <input type="file" name="file" onChange={handleOnChange} />
      <button type="submit" disabled={!isSelected}>Submit</button>
      { parseError && <div>file does not seem to be valid JSON format</div> }
    </form>
  );
};

ProvisionItemsForm.propTypes = {
  handleProvision: PropTypes.func.isRequired,
};

export default ProvisionItemsForm;
