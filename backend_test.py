#!/usr/bin/env python3
"""
Backend API Test Suite for SkillSync Maharashtra
Tests district-aware analytics + regression tests
"""
import requests
import json
import sys
from datetime import datetime

# Base URL from environment
BASE_URL = "https://skill-gap-analysis-2.preview.emergentagent.com/api"

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    END = '\033[0m'

def log_test(name, passed, details=""):
    status = f"{Colors.GREEN}✅ PASS{Colors.END}" if passed else f"{Colors.RED}❌ FAIL{Colors.END}"
    print(f"{status} | {name}")
    if details:
        print(f"    {details}")
    return passed

# ===== DISTRICT-AWARE ANALYTICS TESTS (NEW FEATURE) =====

def test_stats_without_district():
    """Test GET /api/stats (no district param) - should return statewide data"""
    try:
        r = requests.get(f"{BASE_URL}/stats", timeout=5)
        data = r.json()
        
        required_fields = ['total_jobs_analyzed', 'total_skills', 'high_demand_skills', 
                          'emerging_skills', 'critical_skill_gaps', 'courses_requiring_updates',
                          'oversupplied_courses', 'undersupplied_courses', 'districts_covered', 
                          'industries_covered', 'district', 'courses_in_scope']
        
        has_all_fields = all(f in data for f in required_fields)
        district_is_null = data.get('district') is None
        districts_covered_is_10 = data.get('districts_covered') == 10
        
        passed = r.status_code == 200 and has_all_fields and district_is_null and districts_covered_is_10
        
        return log_test("GET /api/stats (no district) - statewide", passed, 
                       f"Status: {r.status_code}, district: {data.get('district')}, districts_covered: {data.get('districts_covered')}")
    except Exception as e:
        return log_test("GET /api/stats (no district)", False, f"Error: {str(e)}")

def test_skill_demand_without_district():
    """Test GET /api/skill-demand (no district param) - should return all 40 skills sorted by demand desc"""
    try:
        r = requests.get(f"{BASE_URL}/skill-demand", timeout=5)
        data = r.json()
        
        is_array = isinstance(data, list)
        count_is_40 = len(data) == 40
        has_required_fields = all('skill_id' in item and 'skill' in item and 'category' in item 
                                  and 'trend' in item and 'demand' in item for item in data)
        
        # Check sorted by demand desc
        demands = [item['demand'] for item in data]
        is_sorted_desc = demands == sorted(demands, reverse=True)
        
        # Top item should have demand 100 (normalized)
        top_demand_is_100 = data[0]['demand'] == 100 if data else False
        
        passed = (r.status_code == 200 and is_array and count_is_40 and 
                 has_required_fields and is_sorted_desc and top_demand_is_100)
        
        return log_test("GET /api/skill-demand (no district) - statewide", passed, 
                       f"Status: {r.status_code}, Count: {len(data)}, Top demand: {data[0]['demand'] if data else 'N/A'}, Sorted: {is_sorted_desc}")
    except Exception as e:
        return log_test("GET /api/skill-demand (no district)", False, f"Error: {str(e)}")

def test_skill_gaps_without_district():
    """Test GET /api/skill-gaps (no district param) - should return all 40 skills with priorities"""
    try:
        r = requests.get(f"{BASE_URL}/skill-gaps", timeout=5)
        data = r.json()
        
        is_array = isinstance(data, list)
        count_is_40 = len(data) == 40
        has_required_fields = all('skill_id' in item and 'skill' in item and 'category' in item 
                                  and 'trend' in item and 'demand' in item and 'coverage' in item 
                                  and 'gap' in item and 'priority' in item for item in data)
        
        # Check priorities are from valid set
        valid_priorities = {'Critical', 'High', 'Medium', 'Low', 'Aligned', 'Oversupply'}
        all_priorities_valid = all(item['priority'] in valid_priorities for item in data)
        
        passed = (r.status_code == 200 and is_array and count_is_40 and 
                 has_required_fields and all_priorities_valid)
        
        priorities_found = set(item['priority'] for item in data)
        return log_test("GET /api/skill-gaps (no district) - statewide", passed, 
                       f"Status: {r.status_code}, Count: {len(data)}, Priorities: {priorities_found}")
    except Exception as e:
        return log_test("GET /api/skill-gaps (no district)", False, f"Error: {str(e)}")

def test_stats_with_district_pune():
    """Test GET /api/stats?district=pune - should return scoped data"""
    try:
        # Get jobs count for pune
        r_jobs = requests.get(f"{BASE_URL}/jobs?district=pune", timeout=5)
        jobs_data = r_jobs.json()
        expected_jobs_count = len(jobs_data)
        
        # Get courses count for pune
        r_courses = requests.get(f"{BASE_URL}/courses?district=pune", timeout=5)
        courses_data = r_courses.json()
        expected_courses_count = len(courses_data)
        
        # Get stats for pune
        r = requests.get(f"{BASE_URL}/stats?district=pune", timeout=5)
        data = r.json()
        
        district_is_pune = data.get('district') == 'pune'
        districts_covered_is_1 = data.get('districts_covered') == 1
        jobs_match = data.get('total_jobs_analyzed') == expected_jobs_count
        courses_match = data.get('courses_in_scope') == expected_courses_count
        
        passed = (r.status_code == 200 and district_is_pune and districts_covered_is_1 and 
                 jobs_match and courses_match)
        
        return log_test("GET /api/stats?district=pune - scoped", passed, 
                       f"Status: {r.status_code}, district: {data.get('district')}, districts_covered: {data.get('districts_covered')}, "
                       f"jobs: {data.get('total_jobs_analyzed')} (expected {expected_jobs_count}), "
                       f"courses: {data.get('courses_in_scope')} (expected {expected_courses_count})")
    except Exception as e:
        return log_test("GET /api/stats?district=pune", False, f"Error: {str(e)}")

def test_stats_with_district_mumbai():
    """Test GET /api/stats?district=mumbai - should return scoped data"""
    try:
        # Get jobs count for mumbai
        r_jobs = requests.get(f"{BASE_URL}/jobs?district=mumbai", timeout=5)
        jobs_data = r_jobs.json()
        expected_jobs_count = len(jobs_data)
        
        # Get courses count for mumbai
        r_courses = requests.get(f"{BASE_URL}/courses?district=mumbai", timeout=5)
        courses_data = r_courses.json()
        expected_courses_count = len(courses_data)
        
        # Get stats for mumbai
        r = requests.get(f"{BASE_URL}/stats?district=mumbai", timeout=5)
        data = r.json()
        
        district_is_mumbai = data.get('district') == 'mumbai'
        districts_covered_is_1 = data.get('districts_covered') == 1
        jobs_match = data.get('total_jobs_analyzed') == expected_jobs_count
        courses_match = data.get('courses_in_scope') == expected_courses_count
        
        passed = (r.status_code == 200 and district_is_mumbai and districts_covered_is_1 and 
                 jobs_match and courses_match)
        
        return log_test("GET /api/stats?district=mumbai - scoped", passed, 
                       f"Status: {r.status_code}, district: {data.get('district')}, districts_covered: {data.get('districts_covered')}, "
                       f"jobs: {data.get('total_jobs_analyzed')} (expected {expected_jobs_count}), "
                       f"courses: {data.get('courses_in_scope')} (expected {expected_courses_count})")
    except Exception as e:
        return log_test("GET /api/stats?district=mumbai", False, f"Error: {str(e)}")

def test_stats_with_district_nagpur():
    """Test GET /api/stats?district=nagpur - should return scoped data"""
    try:
        # Get jobs count for nagpur
        r_jobs = requests.get(f"{BASE_URL}/jobs?district=nagpur", timeout=5)
        jobs_data = r_jobs.json()
        expected_jobs_count = len(jobs_data)
        
        # Get courses count for nagpur
        r_courses = requests.get(f"{BASE_URL}/courses?district=nagpur", timeout=5)
        courses_data = r_courses.json()
        expected_courses_count = len(courses_data)
        
        # Get stats for nagpur
        r = requests.get(f"{BASE_URL}/stats?district=nagpur", timeout=5)
        data = r.json()
        
        district_is_nagpur = data.get('district') == 'nagpur'
        districts_covered_is_1 = data.get('districts_covered') == 1
        jobs_match = data.get('total_jobs_analyzed') == expected_jobs_count
        courses_match = data.get('courses_in_scope') == expected_courses_count
        
        passed = (r.status_code == 200 and district_is_nagpur and districts_covered_is_1 and 
                 jobs_match and courses_match)
        
        return log_test("GET /api/stats?district=nagpur - scoped", passed, 
                       f"Status: {r.status_code}, district: {data.get('district')}, districts_covered: {data.get('districts_covered')}, "
                       f"jobs: {data.get('total_jobs_analyzed')} (expected {expected_jobs_count}), "
                       f"courses: {data.get('courses_in_scope')} (expected {expected_courses_count})")
    except Exception as e:
        return log_test("GET /api/stats?district=nagpur", False, f"Error: {str(e)}")

def test_skill_demand_with_district_pune():
    """Test GET /api/skill-demand?district=pune - should return 40 skills with top demand=100"""
    try:
        r = requests.get(f"{BASE_URL}/skill-demand?district=pune", timeout=5)
        data = r.json()
        
        is_array = isinstance(data, list)
        count_is_40 = len(data) == 40
        top_demand_is_100 = data[0]['demand'] == 100 if data else False
        
        # Check sorted by demand desc
        demands = [item['demand'] for item in data]
        is_sorted_desc = demands == sorted(demands, reverse=True)
        
        passed = (r.status_code == 200 and is_array and count_is_40 and 
                 top_demand_is_100 and is_sorted_desc)
        
        return log_test("GET /api/skill-demand?district=pune - scoped", passed, 
                       f"Status: {r.status_code}, Count: {len(data)}, Top demand: {data[0]['demand'] if data else 'N/A'}, "
                       f"Top skill: {data[0]['skill'] if data else 'N/A'}")
    except Exception as e:
        return log_test("GET /api/skill-demand?district=pune", False, f"Error: {str(e)}")

def test_skill_gaps_with_district_pune():
    """Test GET /api/skill-gaps?district=pune - should return 40 skills with valid priorities"""
    try:
        r = requests.get(f"{BASE_URL}/skill-gaps?district=pune", timeout=5)
        data = r.json()
        
        is_array = isinstance(data, list)
        count_is_40 = len(data) == 40
        
        # Check priorities are from valid set
        valid_priorities = {'Critical', 'High', 'Medium', 'Low', 'Aligned', 'Oversupply'}
        all_priorities_valid = all(item['priority'] in valid_priorities for item in data)
        
        passed = (r.status_code == 200 and is_array and count_is_40 and all_priorities_valid)
        
        priorities_found = set(item['priority'] for item in data)
        return log_test("GET /api/skill-gaps?district=pune - scoped", passed, 
                       f"Status: {r.status_code}, Count: {len(data)}, Priorities: {priorities_found}")
    except Exception as e:
        return log_test("GET /api/skill-gaps?district=pune", False, f"Error: {str(e)}")

def test_scoped_vs_statewide_difference():
    """Test that scoped results differ from statewide for at least one district"""
    try:
        # Get statewide skill-demand
        r_statewide = requests.get(f"{BASE_URL}/skill-demand", timeout=5)
        statewide_data = r_statewide.json()
        
        # Get pune skill-demand
        r_pune = requests.get(f"{BASE_URL}/skill-demand?district=pune", timeout=5)
        pune_data = r_pune.json()
        
        # Compare top 5 skills ordering
        statewide_top5 = [item['skill_id'] for item in statewide_data[:5]]
        pune_top5 = [item['skill_id'] for item in pune_data[:5]]
        
        ordering_differs = statewide_top5 != pune_top5
        
        # Also check stats critical_skill_gaps
        r_stats_statewide = requests.get(f"{BASE_URL}/stats", timeout=5)
        stats_statewide = r_stats_statewide.json()
        
        r_stats_pune = requests.get(f"{BASE_URL}/stats?district=pune", timeout=5)
        stats_pune = r_stats_pune.json()
        
        stats_differ = (stats_statewide.get('critical_skill_gaps') != stats_pune.get('critical_skill_gaps') or
                       stats_statewide.get('high_demand_skills') != stats_pune.get('high_demand_skills'))
        
        passed = ordering_differs or stats_differ
        
        return log_test("Scoped vs statewide - results differ", passed, 
                       f"Skill-demand top5 statewide: {statewide_top5}, pune: {pune_top5}, "
                       f"Stats differ: {stats_differ}")
    except Exception as e:
        return log_test("Scoped vs statewide difference", False, f"Error: {str(e)}")

def test_invalid_district_returns_200():
    """Test GET /api/stats?district=nowhere - should return 200 NOT 500 (fallback to statewide-equivalent)"""
    try:
        r = requests.get(f"{BASE_URL}/stats?district=nowhere", timeout=5)
        data = r.json()
        
        # Should return 200 with total_jobs_analyzed=0 and courses_in_scope=0 (acceptable fallback)
        status_is_200 = r.status_code == 200
        has_required_fields = 'total_jobs_analyzed' in data and 'courses_in_scope' in data
        
        passed = status_is_200 and has_required_fields
        
        return log_test("GET /api/stats?district=nowhere - 200 NOT 500", passed, 
                       f"Status: {r.status_code}, total_jobs_analyzed: {data.get('total_jobs_analyzed')}, "
                       f"courses_in_scope: {data.get('courses_in_scope')}")
    except Exception as e:
        return log_test("GET /api/stats?district=nowhere", False, f"Error: {str(e)}")

def test_invalid_district_skill_demand():
    """Test GET /api/skill-demand?district=nowhere - should return 200"""
    try:
        r = requests.get(f"{BASE_URL}/skill-demand?district=nowhere", timeout=5)
        data = r.json()
        
        passed = r.status_code == 200 and isinstance(data, list) and len(data) == 40
        
        return log_test("GET /api/skill-demand?district=nowhere - 200 NOT 500", passed, 
                       f"Status: {r.status_code}, Count: {len(data)}")
    except Exception as e:
        return log_test("GET /api/skill-demand?district=nowhere", False, f"Error: {str(e)}")

def test_invalid_district_skill_gaps():
    """Test GET /api/skill-gaps?district=nowhere - should return 200"""
    try:
        r = requests.get(f"{BASE_URL}/skill-gaps?district=nowhere", timeout=5)
        data = r.json()
        
        passed = r.status_code == 200 and isinstance(data, list) and len(data) == 40
        
        return log_test("GET /api/skill-gaps?district=nowhere - 200 NOT 500", passed, 
                       f"Status: {r.status_code}, Count: {len(data)}")
    except Exception as e:
        return log_test("GET /api/skill-gaps?district=nowhere", False, f"Error: {str(e)}")

# ===== REGRESSION SMOKE TESTS =====

def test_health():
    """Test GET /api/health"""
    try:
        r = requests.get(f"{BASE_URL}/health", timeout=5)
        data = r.json()
        passed = (r.status_code == 200 and data.get('ok') == True)
        return log_test("GET /api/health", passed, f"Status: {r.status_code}")
    except Exception as e:
        return log_test("GET /api/health", False, f"Error: {str(e)}")

def test_districts():
    """Test GET /api/districts"""
    try:
        r = requests.get(f"{BASE_URL}/districts", timeout=5)
        data = r.json()
        passed = r.status_code == 200 and isinstance(data, list) and len(data) == 10
        return log_test("GET /api/districts", passed, f"Status: {r.status_code}, Count: {len(data)}")
    except Exception as e:
        return log_test("GET /api/districts", False, f"Error: {str(e)}")

def test_industries():
    """Test GET /api/industries"""
    try:
        r = requests.get(f"{BASE_URL}/industries", timeout=5)
        data = r.json()
        passed = r.status_code == 200 and isinstance(data, list) and len(data) == 8
        return log_test("GET /api/industries", passed, f"Status: {r.status_code}, Count: {len(data)}")
    except Exception as e:
        return log_test("GET /api/industries", False, f"Error: {str(e)}")

def test_skills():
    """Test GET /api/skills"""
    try:
        r = requests.get(f"{BASE_URL}/skills", timeout=5)
        data = r.json()
        passed = r.status_code == 200 and isinstance(data, list) and len(data) == 40
        return log_test("GET /api/skills", passed, f"Status: {r.status_code}, Count: {len(data)}")
    except Exception as e:
        return log_test("GET /api/skills", False, f"Error: {str(e)}")

def test_jobs():
    """Test GET /api/jobs"""
    try:
        r = requests.get(f"{BASE_URL}/jobs", timeout=5)
        data = r.json()
        passed = r.status_code == 200 and isinstance(data, list)
        return log_test("GET /api/jobs", passed, f"Status: {r.status_code}, Count: {len(data)}")
    except Exception as e:
        return log_test("GET /api/jobs", False, f"Error: {str(e)}")

def test_courses():
    """Test GET /api/courses"""
    try:
        r = requests.get(f"{BASE_URL}/courses", timeout=5)
        data = r.json()
        passed = r.status_code == 200 and isinstance(data, list)
        return log_test("GET /api/courses", passed, f"Status: {r.status_code}, Count: {len(data)}")
    except Exception as e:
        return log_test("GET /api/courses", False, f"Error: {str(e)}")

def test_district_summary():
    """Test GET /api/district-summary"""
    try:
        r = requests.get(f"{BASE_URL}/district-summary", timeout=5)
        data = r.json()
        passed = r.status_code == 200 and isinstance(data, list) and len(data) == 10
        return log_test("GET /api/district-summary", passed, f"Status: {r.status_code}, Count: {len(data)}")
    except Exception as e:
        return log_test("GET /api/district-summary", False, f"Error: {str(e)}")

def test_district_analytics():
    """Test GET /api/district-analytics?district=pune"""
    try:
        r = requests.get(f"{BASE_URL}/district-analytics?district=pune", timeout=5)
        data = r.json()
        required_fields = ['district', 'top_industries', 'top_skills']
        passed = r.status_code == 200 and all(f in data for f in required_fields)
        return log_test("GET /api/district-analytics?district=pune", passed, f"Status: {r.status_code}")
    except Exception as e:
        return log_test("GET /api/district-analytics", False, f"Error: {str(e)}")

def test_course_alignment():
    """Test GET /api/course-alignment?course_id=c1"""
    try:
        # Get first course id
        r_courses = requests.get(f"{BASE_URL}/courses", timeout=5)
        courses = r_courses.json()
        course_id = courses[0]['id'] if courses else 'c1'
        
        r = requests.get(f"{BASE_URL}/course-alignment?course_id={course_id}", timeout=5)
        data = r.json()
        required_fields = ['alignment_score', 'covered_skills', 'missing_skills']
        passed = r.status_code == 200 and all(f in data for f in required_fields)
        return log_test(f"GET /api/course-alignment?course_id={course_id}", passed, f"Status: {r.status_code}")
    except Exception as e:
        return log_test("GET /api/course-alignment", False, f"Error: {str(e)}")

def test_report_skill_demand():
    """Test GET /api/reports/skill-demand"""
    try:
        r = requests.get(f"{BASE_URL}/reports/skill-demand", timeout=5)
        data = r.json()
        passed = r.status_code == 200 and 'generated_at' in data and 'rows' in data
        return log_test("GET /api/reports/skill-demand", passed, f"Status: {r.status_code}")
    except Exception as e:
        return log_test("GET /api/reports/skill-demand", False, f"Error: {str(e)}")

def test_report_skill_gap():
    """Test GET /api/reports/skill-gap"""
    try:
        r = requests.get(f"{BASE_URL}/reports/skill-gap", timeout=5)
        data = r.json()
        passed = r.status_code == 200 and 'generated_at' in data and 'rows' in data
        return log_test("GET /api/reports/skill-gap", passed, f"Status: {r.status_code}")
    except Exception as e:
        return log_test("GET /api/reports/skill-gap", False, f"Error: {str(e)}")

def test_resources():
    """Test GET /api/resources?skill_id=python"""
    try:
        r = requests.get(f"{BASE_URL}/resources?skill_id=python", timeout=5)
        data = r.json()
        passed = r.status_code == 200 and 'government' in data and 'private' in data and 'youtube' in data
        return log_test("GET /api/resources?skill_id=python", passed, f"Status: {r.status_code}")
    except Exception as e:
        return log_test("GET /api/resources", False, f"Error: {str(e)}")

def test_job_analysis():
    """Test POST /api/job-analysis"""
    try:
        payload = {"text": "Looking for a CNC programmer with PLC and AutoCAD experience"}
        r = requests.post(f"{BASE_URL}/job-analysis", json=payload, timeout=5)
        data = r.json()
        passed = r.status_code == 200 and 'required_skills' in data
        return log_test("POST /api/job-analysis", passed, f"Status: {r.status_code}")
    except Exception as e:
        return log_test("POST /api/job-analysis", False, f"Error: {str(e)}")

def main():
    print(f"\n{Colors.BLUE}{'='*80}{Colors.END}")
    print(f"{Colors.BLUE}SkillSync Maharashtra Backend API Test Suite{Colors.END}")
    print(f"{Colors.BLUE}District-Aware Analytics + Regression Tests{Colors.END}")
    print(f"{Colors.BLUE}Base URL: {BASE_URL}{Colors.END}")
    print(f"{Colors.BLUE}Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}{Colors.END}")
    print(f"{Colors.BLUE}{'='*80}{Colors.END}\n")
    
    results = []
    
    # NEW FEATURE: District-aware analytics
    print(f"\n{Colors.YELLOW}=== NEW FEATURE: District-Aware Analytics ==={Colors.END}\n")
    print(f"{Colors.YELLOW}--- Check 1: WITHOUT district param (statewide) ---{Colors.END}")
    results.append(test_stats_without_district())
    results.append(test_skill_demand_without_district())
    results.append(test_skill_gaps_without_district())
    
    print(f"\n{Colors.YELLOW}--- Check 2: WITH district param (scoped) ---{Colors.END}")
    results.append(test_stats_with_district_pune())
    results.append(test_stats_with_district_mumbai())
    results.append(test_stats_with_district_nagpur())
    results.append(test_skill_demand_with_district_pune())
    results.append(test_skill_gaps_with_district_pune())
    
    print(f"\n{Colors.YELLOW}--- Check 3: Scoped vs statewide difference ---{Colors.END}")
    results.append(test_scoped_vs_statewide_difference())
    
    print(f"\n{Colors.YELLOW}--- Check 4: Invalid district handling (200 NOT 500) ---{Colors.END}")
    results.append(test_invalid_district_returns_200())
    results.append(test_invalid_district_skill_demand())
    results.append(test_invalid_district_skill_gaps())
    
    # REGRESSION: Existing endpoints
    print(f"\n{Colors.YELLOW}=== REGRESSION: Existing Endpoints Smoke Tests ==={Colors.END}\n")
    results.append(test_health())
    results.append(test_districts())
    results.append(test_industries())
    results.append(test_skills())
    results.append(test_jobs())
    results.append(test_courses())
    results.append(test_district_summary())
    results.append(test_district_analytics())
    results.append(test_course_alignment())
    results.append(test_report_skill_demand())
    results.append(test_report_skill_gap())
    results.append(test_resources())
    results.append(test_job_analysis())
    
    # Summary
    passed_count = sum(results)
    total_count = len(results)
    pass_rate = (passed_count / total_count * 100) if total_count > 0 else 0
    
    print(f"\n{Colors.BLUE}{'='*80}{Colors.END}")
    print(f"{Colors.BLUE}TEST SUMMARY{Colors.END}")
    print(f"{Colors.BLUE}{'='*80}{Colors.END}")
    print(f"Total Tests: {total_count}")
    print(f"{Colors.GREEN}Passed: {passed_count}{Colors.END}")
    print(f"{Colors.RED}Failed: {total_count - passed_count}{Colors.END}")
    print(f"Pass Rate: {pass_rate:.1f}%")
    print(f"{Colors.BLUE}{'='*80}{Colors.END}\n")
    
    # Exit with appropriate code
    sys.exit(0 if passed_count == total_count else 1)

if __name__ == "__main__":
    main()
