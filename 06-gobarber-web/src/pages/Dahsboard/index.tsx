import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { isToday, format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';


import {
  Container,
  Header,
  HeaderContent,
  Profile, Content,
  Schedule,
  NextAppointment,
  Calendar,
  Section,
  Appointment
} from './styles'

import logoImg from '../../accets/logo.svg'
import { FiPower, FiClock } from 'react-icons/fi'
import { useAuth } from '../../hooks/Auth';
import api from '../../services/api';

interface MonthAvailabilityItem {
  day: number
  available: boolean
}
interface Appointment {
  id: string
  date: string
  user: {
    name: string
    avatar_url: string
  }
}

const Dashboard: React.FC = () => {

  const { signOut, user } = useAuth()

  const [selectedDate, setSelectedDate] = useState(new Date())
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [monthAvailability, setMonthAvailability] = useState<MonthAvailabilityItem[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])

  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if (modifiers.available) {
      setSelectedDate(day)
    }


  }, [])

  const handleMonthChange = useCallback((month: Date) => {
    setCurrentMonth(month)
  }, [])

  //useEffect e chamando toda vez que uma variavel tem seu valor alterado
  useEffect(() => {
    api.get(`/providers/${user.id}/month-availability`, {
      params: {
        year: currentMonth.getFullYear(),
        month: currentMonth.getMonth() + 1,
      }
    }).then(response => {
      setMonthAvailability(response.data)
    })
  }, [currentMonth, user.id])

  useEffect(() => {
    api.get('/appointments/me', {
      params: {
        year: selectedDate.getFullYear(),
        month: selectedDate.getMonth() + 1,
        day: selectedDate.getDate()
      }
    }).then(response => {
      console.log(response.data)
      setAppointments(response.data)
    })

  }, [selectedDate])

  const disableDays = useMemo(() => {
    const dates = monthAvailability
      .filter(monthDay => monthDay.available === false)
      .map(monthDay => {
        const year = currentMonth.getFullYear()
        const month = currentMonth.getMonth()
        const date = new Date(year, month, monthDay.day)

        return date
      })
    return dates
  }, [currentMonth, monthAvailability])

  const selectDateAsText = useMemo(() => {
    return format(selectedDate, "'Dia' dd 'de' MMMM", { locale: ptBR })

  }, [selectedDate])

  const selectWeekDayText = useMemo(() => {
    return format(selectedDate, 'cccc', { locale: ptBR })
  }, [selectedDate])
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
            {isToday(selectedDate) && <span>Hoje</span>}
            <span>{selectDateAsText}</span>
            <span>{selectWeekDayText}</span>
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
          <Section>
            <strong>Manhã</strong>
            <Appointment>
              <span>
                <FiClock />
              08:00
              </span>
              <div>
                <img src="https://avatars2.githubusercontent.com/u/33097295?s=400&u=67d5d68bc2c8f2526847806ecd87aa51bc99a16d&v=4" alt="Fernando Selvino" />
                <strong>Fernando Selvino</strong>
              </div>

            </Appointment>
            <Appointment>
              <span>
                <FiClock />
              08:00
              </span>
              <div>
                <img src="https://avatars2.githubusercontent.com/u/33097295?s=400&u=67d5d68bc2c8f2526847806ecd87aa51bc99a16d&v=4" alt="Fernando Selvino" />
                <strong>Fernando Selvino</strong>
              </div>

            </Appointment>
          </Section>

          <Section>
            <strong>Tarde</strong>
            <Appointment>
              <span>
                <FiClock />
              08:00
              </span>
              <div>
                <img src="https://avatars2.githubusercontent.com/u/33097295?s=400&u=67d5d68bc2c8f2526847806ecd87aa51bc99a16d&v=4" alt="Fernando Selvino" />
                <strong>Fernando Selvino</strong>
              </div>

            </Appointment>
            <Appointment>
              <span>
                <FiClock />
              08:00
              </span>
              <div>
                <img src="https://avatars2.githubusercontent.com/u/33097295?s=400&u=67d5d68bc2c8f2526847806ecd87aa51bc99a16d&v=4" alt="Fernando Selvino" />
                <strong>Fernando Selvino</strong>
              </div>
            </Appointment>
          </Section>

        </Schedule>
        <Calendar>
          <DayPicker
            fromMonth={new Date()}
            onMonthChange={handleMonthChange}
            disabledDays={[{ daysOfWeek: [0, 6] }, ...disableDays]}
            modifiers={{
              available: { daysOfWeek: [1, 2, 3, 4, 5] }
            }}
            weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
            months={[
              'JANEIRO',
              'FEVEREIRO',
              'MARÇO',
              'ABRIL',
              'MAIO',
              'JUNHO',
              'JULHO',
              'AGOSTO',
              'SETEMBRO',
              'OUTUBRO',
              'NOVEMBRO',
              'DEZEMBRO'
            ]}
            selectedDays={selectedDate}
            onDayClick={handleDateChange}
          />
        </Calendar>

      </Content>

    </Container>
  )
}


export default Dashboard;
