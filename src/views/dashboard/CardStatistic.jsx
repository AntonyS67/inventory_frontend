import { Card, CardContent, Typography } from '@mui/material'

import CustomAvatar from '@/@core/components/mui/Avatar'

export default function CardStatistic({ title, value, icon }) {
  return (
    <Card>
      <CardContent>
        <div className='flex flex-col plb-2.25'>
          <div className='flex items-center mbe-2.5 gap-x-[6px]'>
            <CustomAvatar skin='light' color='info' variant='rounded' size={24}>
              <i className={`${icon} text-lg`} />
            </CustomAvatar>
            <Typography>{title}</Typography>
          </div>
          <Typography variant='h5'>{value}</Typography>
        </div>
      </CardContent>
    </Card>
  )
}
