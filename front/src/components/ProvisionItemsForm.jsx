import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Typography,
  Input,
  Button,
  Box,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';

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
      <Typography variant="h6" align="center">PROVISIONING</Typography>
      <Box align="center" mt={3}>
        <Input type="file" name="file" onChange={handleOnChange} />
        <Button variant="contained" color="primary" type="submit" disabled={!isSelected}>Submit</Button>
      </Box>
      { parseError && <Alert severity="error">file does not seem to be valid JSON format</Alert> }
    </form>
  );
};

ProvisionItemsForm.propTypes = {
  handleProvision: PropTypes.func.isRequired,
};

export default ProvisionItemsForm;
