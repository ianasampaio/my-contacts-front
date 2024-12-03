import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { Container, InputSearchContainer, Header, ListHeader, Card, ErrorContainer, EmptyListContainer, SearchNotFoundContainer } from './styles';

// import Modal from '../../components/Modal';
import arrow from '../../assets/images/icons/arrow.svg';
import edit from '../../assets/images/icons/edit.svg';
import trash from '../../assets/images/icons/trash.svg';
import sad from '../../assets/images/sad.svg';
import emptyBox from '../../assets/images/emptyBox.svg';
import magnifierQuestion from '../../assets/images/magnifierQuestion.svg';

import Loader from '../../components/Loader';
import Button from '../../components/Button';

import ContactsService from '../../services/ContactsService';

export default function Home() {
  const [contacts, setContacts] = useState([]);
  const [orderBy, setOrderBy] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const filteredContacts = useMemo(() => contacts.filter((contact) => (
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  )), [contacts, searchTerm]);

  const loadContacts = useCallback(async() => {
    try {
      setIsLoading(true);

      const contactsList = await ContactsService.listContacts(orderBy);

      setHasError(false);
      setContacts(contactsList);
    } catch (error) {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, [orderBy]);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  function handleToogleOrderBy() {
    setOrderBy(
      (prevState) => (prevState === 'asc' ? 'desc' : 'asc'),
    );
  }

  function handleChangeSearchTerm(event) {
    setSearchTerm(event.target.value);
  }

  function handleTryAgain(event) {
    loadContacts();
  }

  return (
    <Container>

      <Loader isLoading={isLoading} />

      {/* <Modal danger/> */}

      {contacts.length > 0 && (
        <InputSearchContainer>
          <input
            value={searchTerm}
            type='text'
            placeholder='Search by name...'
            onChange={handleChangeSearchTerm}
          />
        </InputSearchContainer>
      )}

      <Header
        $justifyContent={
          hasError
            ? 'flex-end'
            : (
              contacts.length > 0
                ? 'space-between'
                : 'center'
            )
        }
      >
        {(!hasError && contacts.length > 0) && (
          <strong>
            {filteredContacts.length}
            {filteredContacts.length === 1 ? ' contato' : ' contatos'}
          </strong>
        )}
        <Link to='/new'>New Contact</Link>
      </Header>

      {hasError && (
        <ErrorContainer>
          <img src={sad} alt='sad' />

          <div className='details'>
            <strong>An error occurred while retrieving your contacts!</strong>
            <Button type='button' onClick={handleTryAgain}>
              Try again
            </Button>
          </div>
        </ErrorContainer>
      )}

      {!hasError &&(
        <>

          {(contacts.length < 1 && !isLoading) && (
            <EmptyListContainer>
              <img src={emptyBox} alt='empty box'/>

              <p>
              You don't have any contacts registered yet!
              Click the <strong>New contact</strong> button above to register your first one!
              </p>
            </EmptyListContainer>
          )}

          {(contacts.length > 0 && filteredContacts.length < 1) && (
            <SearchNotFoundContainer>
              <img src={magnifierQuestion} alt='magnifier question' />

              <span>No results were found for <strong>"{searchTerm}"</strong>.</span>
            </SearchNotFoundContainer>
          )}

          {filteredContacts.length > 0 && (
            <ListHeader $orderBy={orderBy} >
              <header>
                <button type='button' onClick={handleToogleOrderBy}>
                  <span>Name</span>
                  <img src={arrow} alt='arrow' />
                </button>
              </header>
            </ListHeader>
          )}

          {filteredContacts.map((contact) => (
            <Card key={contact.id}>
              <div className='info'>
                <div className='contact-name'>
                  <strong>{contact.name}</strong>
                  {contact.category_name && (
                    <small>{contact.category_name}</small>
                  )}
                </div>
                <span>{contact.email}</span>
                <span>{contact.phone}</span>
              </div>

              <div className='actions'>
                <Link to={`/edit/${contact.id}`}>
                  <img src={edit} alt='edit'/>
                </Link>
                <button type='button'>
                  <img src={trash} alt='delete'/>
                </button>
              </div>
            </Card>
          ))}
        </>
      )}

    </Container>
  )
}
