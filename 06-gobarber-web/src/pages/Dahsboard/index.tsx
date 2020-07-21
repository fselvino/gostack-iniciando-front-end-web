import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { isToday, format, parseISO, isAfter } from 'date-fns'
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
import { Link } from 'react-router-dom';

interface MonthAvailabilityItem {
  day: number
  available: boolean
}
interface Appointment {
  id: string
  hourFormatted: string
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
    if (modifiers.available && !modifiers.disabled) {
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
    api.get<Appointment[]>('/appointments/me', {
      params: {
        year: selectedDate.getFullYear(),
        month: selectedDate.getMonth() + 1,
        day: selectedDate.getDate()
      }
    }).then(response => {
      const appointmentsFormatted = response.data.map(appointment => {
        return {
          ...appointment,
          hourFormatted: format(parseISO(appointment.date), 'HH:mm')
        }
      })
      //console.log(response.data)
      setAppointments(appointmentsFormatted)
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

  const morningAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      return parseISO(appointment.date).getHours() < 12
    })
  },
    [appointments])

  const afternoonAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      return parseISO(appointment.date).getHours() >= 12
    })
  },
    [appointments])

  const nextAppointment = useMemo(() => {
    return appointments.find(appointment => isAfter(parseISO(appointment.date), new Date()))
  }, [appointments])
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
              <Link to="/profile"><strong>{user.name}</strong></Link>
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

          {isToday(selectedDate) && nextAppointment && (
            <NextAppointment>
              <strong>Agendamento a seguir</strong>
              <div>
                <img src={nextAppointment.user.avatar_url}
                  alt={nextAppointment.user.name} />
                <strong>{nextAppointment.user.name}</strong>
                <span>
                  <FiClock />
                  {nextAppointment.hourFormatted}
                </span>
              </div>
            </NextAppointment>
          )}
          <Section>
            <strong>Manhã</strong>
            {morningAppointments.length === 0 && (
              <p>Nenhem agendamento neste período</p>
            )}
            {morningAppointments.map(appointment => (
              <Appointment key={appointment.id}>
                <span>
                  <FiClock />
                  {appointment.hourFormatted}
                </span>
                <div>
                  <img src={appointment.user.avatar_url}
                    alt={appointment.user.name} />
                  <strong>{appointment.user.name}</strong>
                </div>
              </Appointment>
            ))}
          </Section>

          <Section>
            <strong>Tarde</strong>

            {afternoonAppointments.length === 0 && (
              <p>Nenhem agendamento neste período</p>
            )}

            {afternoonAppointments.map(appointment => (
              <Appointment key={appointment.id}>
                <span>
                  <FiClock />
                  {appointment.hourFormatted}
                </span>
                <div>
                  <img src={appointment.user.avatar_url}
                    alt={appointment.user.name} />
                  <strong>{appointment.user.name}</strong>
                </div>
              </Appointment>
            ))}
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
