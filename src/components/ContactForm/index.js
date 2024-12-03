import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import isEmailValid from '../../utils/isEmailvalid';
import formatPhone from '../../utils/formatPhone';
import useErrors from '../../hooks/useErrors';

import { Form, ButtonContainer } from './styles';

import FormGroup from '../FormGroup';
import Input from '../Input';
import Select from '../Select';
import Button from '../Button';
import CategoriesService from '../../services/CategoriesService';

export default function ContactForm({ buttonLabel, onSubmit }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    errors,
    setError,
    removeError,
    getErrorMessageByFielName
  } = useErrors();

  const isFormValid = (name && errors.length === 0);

  useEffect(() => {
    async function loadCategories() {
      try {
        const categoriesList = await CategoriesService.listCategories();

        setCategories(categoriesList);
      } catch {} finally {
        setIsLoadingCategories(false);
      }
    }

    loadCategories();
  }, [])

  function handleNameChange(event) {
    setName(event.target.value);

    if (!event.target.value) {
      setError({ field: 'name', message: 'Name is required.'});
    } else {
      removeError('name');
    }
  }

  function handleEmailChange(event) {
    setEmail(event.target.value);

    if (event.target.value && !isEmailValid(event.target.value)) {
      setError({ field: 'email', message: 'Invalid e-mail' });
    } else {
      removeError('email');
    }
  }

  function handlePhoneChange(event) {
    setPhone(formatPhone(event.target.value));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);

    await onSubmit({
      name, email, phone, categoryId
    });

    setIsSubmitting(false);

  }

  return (
    <>
      <Form onSubmit={handleSubmit} noValidate>
        <FormGroup error={getErrorMessageByFielName('name')}>
          <Input
            error={getErrorMessageByFielName('name')}
            placeholder='Name *'
            value={name}
            onChange={handleNameChange}
            disabled={isSubmitting}
          />
        </FormGroup>

        <FormGroup error={getErrorMessageByFielName('email')}>
          <Input
            type='email'
            error={getErrorMessageByFielName('email')}
            placeholder='E-mail'
            value={email}
            onChange={handleEmailChange}
            disabled={isSubmitting}
          />
        </FormGroup>

        <FormGroup>
          <Input
            placeholder='Phone'
            value={phone}
            onChange={handlePhoneChange}
            maxLength={15}
            disabled={isSubmitting}
          />
        </FormGroup>

        <FormGroup isLoading={isLoadingCategories}>
          <Select
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
            disabled={isLoadingCategories || isSubmitting}
          >
            <option value=''>Without category</option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </Select>
        </FormGroup>

        <ButtonContainer>
          <Button
            type='submit'
            disabled={!isFormValid}
            isLoading={isSubmitting}
            >
            {buttonLabel}
          </Button>
        </ButtonContainer>

      </Form>
    </>
  );
}

ContactForm.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
}
