import { Card, CardContent, Grid2, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import { PeselInfo } from "./App";


const PeselCard = (props: PeselInfo) => {
    return (
        <Card sx={{ marginBottom: "10px", marginRight: "10px", marginTop: "10px", minWidth:"15em"}}>
            <CardContent>
                <Grid2 container justifyContent={"space-between"}>
                    <Grid2>
                        <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                            {props.pesel}
                        </Typography>
                    </Grid2>
                    <Grid2>
                        <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                            {props.sex}
                        </Typography>
                    </Grid2>
                </Grid2>
                <Grid2 container justifyContent={"space-between"}>
                    <Grid2>
                        <Typography variant="h5">
                            {props.date.format("DD.MM.YYYY")}
                        </Typography>
                    </Grid2>
                    <Grid2>
                        <Typography variant="h5">
                            {props.digits}
                        </Typography>
                    </Grid2>
                </Grid2>
            </CardContent>
        </Card>
    );
}

export default PeselCard;