import './App.css'
import { Box, Button, Grid2, Stack, TextField, Typography } from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateValidationError, LocalizationProvider, PickerChangeHandlerContext } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import 'dayjs/locale/pl';
import PeselCard from "./PeselCard";


export interface PeselInfo {
  pesel: string
  sex: string
  date: dayjs.Dayjs
  digits: string
}

function App() {
  const [numbers, setNumbers] = useState("");
  const [error, setError] = useState(false);
  const [counter, setCounter] = useState(0);
  const [numbersError, setNumbersError] = useState("");
  const [date, setDate] = useState<dayjs.Dayjs | null>(null);

  const [list, setList] = useState<PeselInfo[]>([]);


  const onDateChange = (value: Dayjs | null, context: PickerChangeHandlerContext<DateValidationError>) => {
    setDate(value);
  }

  const onNumberChanged = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let result = event.target.value;
    if (result.length != 5 && result.length != 0) {
      setNumbersError("Ilość cyfr musi być równa 5.")
    }
    else if (!containsDigit(result)) {
      setNumbersError("Jeden ze znaków nie jest liczbą.")
    }
    else {
      setNumbersError("")
    }
    setNumbers(result)
  }
  const containsDigit = (text: string): boolean => {
    for (let index = 0; index < [...text].length; index++) {
      const c = [...text][index];
      if (!is_numeric(c)) {
        return false;
      }
    }
    return true;
  }
  function is_numeric(str: string) {
    return /^\d+$/.test(str);
  }

  const onClick = () => {
    setList([])
    if (date && numbers) {
      handleSinglePesel();
    }
    else if (date && !numbers) {
      handlePeselsByDate();
    }
    else if (!date && numbers) {
      handlePeselsByDigits();
    }
  }

  const handleSinglePesel = () => {
    const worker = new Worker(new URL('./webworkers/validate_one_pesel.js', import.meta.url));
    worker.postMessage({ day: date?.get("D"), month: (date?.get("M")! + 1), year: date?.get("y"), digits: numbers });

    worker.onmessage = function (e) {
      const { error, result } = e.data;
      if (error) {
        setError(true);
        setList([]);
      }
      else {
        setList([
          {
            date: dayjs(`${result.year}.${result.month}.${result.day}`),
            sex: result.sex,
            pesel: result.pesel,
            digits: result.digits
          }
        ])
        setError(false);
      }
    };
  }
  const handlePeselsByDate = () => {
    const worker = new Worker(new URL('./webworkers/show_all_pesels.js', import.meta.url));
    worker.postMessage({ day: date?.get("D"), month: (date?.get("M")! + 1), year: date?.get("y") });

    worker.onmessage = function (e) {
      const { error, result } = e.data;
      if (error) {
        setError(true);
      }
      else if (result) {
        setList(oldArray => [...oldArray, {
          date: dayjs(`${result.year}.${result.month}.${result.day}`),
          sex: result.sex,
          pesel: result.pesel,
          digits: result.digits
        }]);

        setError(false);
      }
    };
  }
  const handlePeselsByDigits = () => {
    const worker = new Worker(new URL('./webworkers/find_valid_pesels.js', import.meta.url));
    worker.postMessage({ digits: numbers });

    worker.onmessage = function (e) {
      const { error, result } = e.data;
      if (error) {
        setError(true);
      }
      else if (result) {
        setList(oldArray => [...oldArray, {
          date: dayjs(`${result.year}.${result.month}.${result.day}`),
          sex: result.sex,
          pesel: result.pesel,
          digits: result.digits
        }]);

        setError(false);
      }
    };
  }
  function addCount(): void {
    setCounter(counter + 1);
  }

  return (
    <>
      <Box maxWidth={"50vw"} alignItems={"center"}>
        <Grid2 spacing={2} container maxWidth={"30em"}>
          <Grid2 size={5}>
            <LocalizationProvider adapterLocale="pl" dateAdapter={AdapterDayjs}>
              <DatePicker
                value={date}
                onChange={onDateChange}
                label="Wybierz datę" />
            </LocalizationProvider>
          </Grid2>
          <Grid2 size={6}>
            <TextField
              required
              error={!!numbersError}
              helperText={numbersError}
              id="numbers"
              name="numbers"
              label="Wpisz cyfry"
              type="text"
              placeholder="12345"
              fullWidth
              value={numbers}
              onChange={onNumberChanged}
            />
          </Grid2>
          <Grid2 size={1}>
            <Button variant="contained" size="large" onClick={onClick}>Go</Button>
          </Grid2>
          {
            error &&
            <Grid2 size={12}>
              <Typography color="error">No Result</Typography>
            </Grid2>
          }
        </Grid2>
        {/* <Grid2 size={6}>
          <Button onClick={addCount}>+</Button>
        </Grid2>
        <Grid2 size={6}>
          <Typography>Counter: {counter}</Typography>
        </Grid2> */}
        <Grid2 container>
          {list &&
            list.map(p =>
              <Grid2 key={p.pesel}>
                <PeselCard date={p.date} sex={p.sex} pesel={p.pesel} digits={p.digits}></PeselCard>
              </Grid2>
            )
          }
        </Grid2>
      </Box>
    </>
  );
}

export default App
