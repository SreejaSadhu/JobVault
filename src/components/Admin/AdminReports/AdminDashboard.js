import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";
import "../Admin-CSS/AdminDashboard.css";
import Footer from "../AdminReusableComponents/AdminFooter.js";
import AdminHome from "../AdminHome.js";
import { useTable, useSortBy, usePagination, useGlobalFilter } from 'react-table';

function GlobalFilter({ globalFilter, setGlobalFilter }) {
  return (
    <span style={{ marginRight: 10 }}>
      Search:{" "}
      <input
        value={globalFilter || ""}
        onChange={e => setGlobalFilter(e.target.value)}
        placeholder="Type to search..."
        style={{ fontSize: '1.1rem', padding: '2px 8px' }}
      />
    </span>
  );
}

function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState("");
  const [originalUsers, setOriginalUsers] = useState([]);
  const [filters, setFilters] = useState({
    tenthPercentage: "",
    twelfthPercentage: "",
    graduationCGPA: "",
    yearOfGraduation: "",
    placementStatus: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/admin/verify`).then((res) => {
      if (!res.data.status) navigate("/");
    });
  }, [navigate]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/auth/getUsers`)
      .then((response) => {
        setUsers(response.data.data);
        setOriginalUsers(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(users);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.writeFile(workbook, "users_data.xlsx");
  };

  const applyFilters = () => {
    let filteredUsers = originalUsers.filter((user) => {
      return (
        (!filters.tenthPercentage ||
          user.tenthPercentage >= parseFloat(filters.tenthPercentage)) &&
        (!filters.twelfthPercentage ||
          user.twelfthPercentage >= parseFloat(filters.twelfthPercentage)) &&
        (!filters.graduationCGPA ||
          user.graduationCGPA >= parseFloat(filters.graduationCGPA)) &&
        (!filters.yearOfGraduation ||
          user.yearOfGraduation === parseInt(filters.yearOfGraduation)) &&
        (!selectedProgram || user.stream === selectedProgram) &&
        (!filters.placementStatus ||
          user.placementStatus === filters.placementStatus)
      );
    });
    setSelectedProgram("");
    setUsers(filteredUsers);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleProgramChange = (e) => {
    setSelectedProgram(e.target.value);
  };

  const resetFilters = () => {
    setFilters({
      tenthPercentage: "",
      twelfthPercentage: "",
      graduationCGPA: "",
      yearOfGraduation: "",
      placementStatus: "",
    });
    setUsers(originalUsers);
  };

  const assignViewerRole = async (userId, userName) => {
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/admin/assignViewerRole`, { userId });
      setMessage(`Viewer role assigned to ${userName}`);
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Error assigning viewer role");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  // --- react-table setup ---
  const columns = useMemo(() => [
    { Header: 'Name', accessor: 'name' },
    { Header: 'Email', accessor: 'email' },
    { Header: 'Contact Number', accessor: 'contactNumber' },
    { Header: 'SAP ID', accessor: 'sapId' },
    { Header: 'Date of Birth', accessor: 'dob' },
    { Header: '10th Percentage', accessor: 'tenthPercentage' },
    { Header: '10th School', accessor: 'tenthSchool' },
    { Header: '12th Percentage', accessor: 'twelfthPercentage' },
    { Header: '12th College', accessor: 'twelfthCollege' },
    { Header: 'Graduation College', accessor: 'graduationCollege' },
    { Header: 'Graduation CGPA', accessor: 'cgpa' },
    { Header: 'Stream', accessor: 'stream' },
    { Header: 'Year of Graduation', accessor: 'yearOfGraduation' },
    { Header: 'Placement Status', accessor: 'placementStatus' },
    { Header: 'Company Placed', accessor: 'companyPlaced' },
    {
      Header: 'Actions',
      id: 'actions',
      Cell: ({ row }) => (
        <button
          onClick={() => assignViewerRole(row.original._id, row.original.name)}
          style={{
            backgroundColor: "#ffc107",
            color: "#212529",
            border: "none",
            padding: "3px 8px",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "12px"
          }}
          title="Grant viewer access to this user"
        >
          Grant Viewer Access
        </button>
      )
    }
  ], []);

  const data = useMemo(() => users, [users]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    state,
    setGlobalFilter,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const { globalFilter, pageIndex, pageSize } = state;

  return (
    <>
      <AdminHome />
      <div className="admin-dashboard-container">
        {message && (
          <div style={{ 
            backgroundColor: "#d4edda", 
            border: "1px solid #c3e6cb", 
            borderRadius: "5px", 
            padding: "15px", 
            marginBottom: "20px",
            color: "#155724"
          }}>
            {message}
          </div>
        )}
        <h1 className="admin-section-title">User Reports</h1>
        <div className="admin-filter-box">
          <div className="filter-group">
            <label htmlFor="tenthPercentage" className="filter-label">
              Filter by 10th Percentage:
            </label>
            <input
              type="number"
              id="tenthPercentage"
              name="tenthPercentage"
              value={filters.tenthPercentage}
              onChange={handleChange}
              className="filter-input"
            />
          </div>
          <div className="filter-group">
            <label htmlFor="twelfthPercentage" className="filter-label">
              Filter by 12th Percentage:
            </label>
            <input
              type="number"
              id="twelfthPercentage"
              name="twelfthPercentage"
              value={filters.twelfthPercentage}
              onChange={handleChange}
              className="filter-input"
            />
          </div>
          <div className="filter-group">
            <label htmlFor="graduationCGPA" className="filter-label">
              Filter by Graduation CGPA:
            </label>
            <input
              type="number"
              id="graduationCGPA"
              name="graduationCGPA"
              value={filters.graduationCGPA}
              onChange={handleChange}
              className="filter-input"
            />
          </div>
          <div className="filter-group">
            <label htmlFor="yearOfGraduation" className="filter-label">
              Filter by Year of Graduation:
            </label>
            <input
              type="number"
              id="yearOfGraduation"
              name="yearOfGraduation"
              value={filters.yearOfGraduation}
              onChange={handleChange}
              className="filter-input"
            />
          </div>
          <div className="filter-group">
            <label htmlFor="stream" className="filter-label">
              Filter by Program:
            </label>
            <select
              id="stream"
              name="stream"
              value={selectedProgram}
              onChange={handleProgramChange}
              className="filter-input"
            >
              <option value="">Select Stream</option>
              <option value="MCA">MCA</option>
              <option value="Btech-IT">Btech-IT</option>
              <option value="Btech-CS">Btech-CS</option>
              <option value="Btech-Cybersecurity">Btech-Cybersecurity</option>
              <option value="Btech-Data Science">Btech-Data Science</option>
              <option value="Btech-Mechatronics">Btech-Mechatronics</option>
              <option value="Btech-EXTC">Btech-Extc</option>
              <option value="BTech-Integrated">BTech-Integrated</option>
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="placementStatus" className="filter-label">
              Filter by Placement Status:
            </label>
            <select
              id="placementStatus"
              name="placementStatus"
              value={filters.placementStatus}
              onChange={handleChange}
              className="filter-input"
            >
              <option value="">Select Status</option>
              <option value="Placed">Placed</option>
              <option value="Unplaced">Unplaced</option>
            </select>
          </div>
          <div className="filter-group">
            <button
              onClick={applyFilters}
              className="admin-btn admin-btn-primary button-spacing"
            >
              Apply Filters
            </button>
            <button onClick={resetFilters} className="admin-btn admin-btn-secondary">
              Reset Filters
            </button>
            <button onClick={handleDownload} className="admin-btn admin-btn-download">
              Download
            </button>
          </div>
          <div className="admin-search-box" style={{ flex: 1, minWidth: 200 }}>
            <GlobalFilter globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
          </div>
        </div>
        <div className="admin-table-container">
          <table className="user-table" {...getTableProps()}>
            <thead>
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <th {...column.getHeaderProps(column.getSortByToggleProps())} style={{ whiteSpace: 'nowrap' }}>
                      {column.render('Header')}
                      <span>
                        {column.isSorted
                          ? column.isSortedDesc
                            ? ' 🔽'
                            : ' 🔼'
                          : ''}
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map(row => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map(cell => (
                      <td {...cell.getCellProps()} style={{ whiteSpace: 'nowrap' }}>{cell.render('Cell')}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* Pagination Controls */}
        <div className="admin-pagination">
          <button onClick={() => gotoPage(0)} disabled={!canPreviousPage} className="admin-btn admin-btn-secondary">{'<<'}</button>
          <button onClick={() => previousPage()} disabled={!canPreviousPage} className="admin-btn admin-btn-secondary">{'<'}</button>
          <span>
            Page{' '}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>{' '}
          </span>
          <button onClick={() => nextPage()} disabled={!canNextPage} className="admin-btn admin-btn-secondary">{'>'}</button>
          <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} className="admin-btn admin-btn-secondary">{'>>'}</button>
          <span>
            | Go to page:{' '}
            <input
              type="number"
              defaultValue={pageIndex + 1}
              onChange={e => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                gotoPage(page);
              }}
              style={{ width: '60px' }}
            />
          </span>
          <select
            value={pageSize}
            onChange={e => setPageSize(Number(e.target.value))}
            className="admin-btn admin-btn-secondary"
          >
            {[10, 20, 30, 40, 50].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default AdminDashboard;
