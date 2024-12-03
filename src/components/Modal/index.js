import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import { Container, Overlay, Footer } from "./styles";

import Button from '../Button';

export default function Modal({ danger }) {
  return ReactDOM.createPortal(
    <Overlay>
      <Container danger={danger}>
        <h1>Title</h1>

        <p>
          Content
        </p>

        <Footer>
          <button type="button" className="cancel-button">Cancel</button>

          <Button type="button" danger={danger}>
            Delete
          </Button>
        </Footer>

      </Container>
    </Overlay>,
    document.getElementById('modal-root'),
  );
}

Modal.propTypes = {
  danger: PropTypes.bool,
}

Modal.defaultProps = {
  danger: false,
}
