import React from 'react';
import { Container, Header, HeaderContent, Profile, Content, Schedule, NextAppointment, Calendar } from './styles'

import logoImg from '../../accets/logo.svg'
import { FiPower, FiClock } from 'react-icons/fi'
import { useAuth } from '../../hooks/Auth';

const Dashboard: React.FC = () => {

  const { signOut, user } = useAuth()

  //console.log(user)

  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={logoImg} alt="Gobarber" />
          <Profile>
            <img src={user.avatar_url} alt={user.name} />
            <div>
              <span>Bem Vindo</span>
              <strong>{user.name}</strong>
            </div>
          </Profile>

          <button type="button"
            onClick={signOut}
          >
            <FiPower />
          </button>
        </HeaderContent>
      </Header>
      <Content>
        <Schedule>
          <h1>Horários agendados</h1>
          <p>
            <span>Hoje</span>
            <span>Dia 06</span>
            <span>Segunda-feira</span>
          </p>

          <NextAppointment>
            <strong>Atendimento a seguir</strong>
            <div>
              <img src="https://avatars2.githubusercontent.com/u/33097295?s=400&u=67d5d68bc2c8f2526847806ecd87aa51bc99a16d&v=4" alt="Fernando Selvino" />
              <strong>Fernando Selvino</strong>
              <span>
                <FiClock /> 08:00
              </span>
            </div>
          </NextAppointment>

        </Schedule>
        <Calendar />

      </Content>

    </Container>
  )
}


export default Dashboard;
