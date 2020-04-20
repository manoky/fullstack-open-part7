import React from 'react'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import { Link } from 'react-router-dom'

const Blog = ({ blog }) => {

  return (
    <TableRow>
      <TableCell
        className="blog-preview"
        style={{ cursor: 'pointer' }}
      >
        <Link to={`blogs/${blog.id}`}>
          {blog.title}
        </Link>
      </TableCell>
      <TableCell>
        {blog.author}
      </TableCell>
    </TableRow>
  )
}


export default Blog
