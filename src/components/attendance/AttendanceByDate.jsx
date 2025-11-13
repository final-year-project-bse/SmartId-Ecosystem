import { Card } from '../ui/Card';
import { Table } from '../ui/Table';
import { Badge } from '../ui/Badge';
import { format } from 'date-fns';

const AttendanceByDate = ({ data }) => {
  const headers = ['Date', 'Course', 'Present', 'Absent', 'Attendance %'];

  const renderRow = (row) => (
    <>
      <td className="py-3 px-4 text-sm text-slate-900 dark:text-slate-100">
        {format(new Date(row.date), 'MMM dd, yyyy')}
      </td>
      <td className="py-3 px-4 text-sm text-slate-900 dark:text-slate-100">{row.course}</td>
      <td className="py-3 px-4 text-sm">
        <Badge variant="success">{row.present}</Badge>
      </td>
      <td className="py-3 px-4 text-sm">
        <Badge variant="danger">{row.absent}</Badge>
      </td>
      <td className="py-3 px-4 text-sm">
        <Badge variant={row.percentage >= 75 ? 'success' : 'warning'}>
          {row.percentage}%
        </Badge>
      </td>
    </>
  );

  return (
    <Card title="Attendance by Date">
      <Table headers={headers} data={data} renderRow={renderRow} />
    </Card>
  );
};

export default AttendanceByDate;
