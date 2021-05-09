import { useState } from 'react';
import PropTypes from 'prop-types';

import readFile from '../lib/readFile';

const ProvisionItemsForm = ({ handleProvision }) => {
  const [targetFile, setTargetFile] = useState();
  const [isSelected, setIsSelected] = useState(false);

  const handleOnChange = (event) => {
    setTargetFile(event.target.files[0]);
    setIsSelected(true);
  };

  const handleOnSubmit = async (event) => {
    event.preventDefault();
    const fileContents = await readFile(targetFile);
    const payload = JSON.parse(fileContents);
    handleProvision(payload);
  };

  return (
    <form onSubmit={handleOnSubmit}>
      <h3>PROVISIONING</h3>
      <input type="file" name="file" onChange={handleOnChange} />
      <button type="submit" disabled={!isSelected}>Submit</button>
    </form>
  );
};

ProvisionItemsForm.propTypes = {
  handleProvision: PropTypes.func.isRequired,
};

export default ProvisionItemsForm;
